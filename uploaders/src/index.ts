import AuthorModel from "@/models/author";
import { faker } from "@faker-js/faker";
import BookModel from "@/models/book";
import { formatFileSize, generateS3ClientPublicUrl } from "@/utils/helper";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import slugify from "slugify";
import UserModel from "@/models/user";
import mongoose from "mongoose";
import { v2 as cloud } from "cloudinary";

cloud.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const uploadMethods = ["aws", "local"];
const uploadMethod = process.env.UPLOAD_METHOD;

if (!uploadMethod || !uploadMethods.includes(uploadMethod)) {
  throw new Error("Please add 'UPLOAD_METHOD' inside .env");
}

const s3Client = new S3Client({
  region: "ap-southeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

type bookType = {
  epubPath: string;
  coverPath: string;
  publishedAt: string;
  title: string;
  description: string;
  price: {
    mrp: number;
    sale: number;
  };
  genre: string;
  publicationName: string;
  language: string;
};

type bookData = {
  title: string;
  description: string;
  price: { mrp: number; sale: number };
  genre: string;
  publicationName: string;
  language: string;
};

const uri = process.env.MONGO_URI;
const connectToDB = async () => {
  if (!uri) throw new Error("Mongodb uri is missing!");

  await mongoose.connect(uri);
  console.log("db is connected!");
};

const getRandomDate = () => {
  const startDate = new Date("2020-01-01").getTime(); // Start date as milliseconds since Unix epoch
  const endDate = new Date().getTime(); // Current date as milliseconds since Unix epoch
  const randomTimestamp = Math.floor(
    Math.random() * (endDate - startDate) + startDate
  ); // Random timestamp between start and end dates
  const randomDate = new Date(randomTimestamp); // Convert random timestamp to a Date object
  return randomDate.toISOString().slice(0, 10); // Format Date object as 'YYYY-MM-DD'
};

// this function will read the given directory (folder) and returns an array with the name of files.
const generateFilePaths = (localDir: string) => {
  const booksPath = path.join(__dirname, localDir);
  const bookList = fs.readdirSync(booksPath);

  return bookList.map((fileName) => {
    return path.join(__dirname, `${localDir}/${fileName}`);
  });
};

const createNewBook = async (data: bookType, authorId: string) => {
  try {
    const newBook = new BookModel({
      title: data.title,
      description: data.description,
      fileInfo: {
        size: formatFileSize(fs.statSync(data.epubPath).size),
      },
      language: data.language,
      price: {
        sale: data.price.sale,
        mrp: data.price.mrp,
      },
      publicationName: data.publicationName,
      publishedAt: data.publishedAt,
      author: authorId,
      genre: data.genre,
    });

    newBook.slug = slugify(`${newBook.title} ${newBook._id}`, {
      lower: true,
      replacement: "-",
    });

    const uniqueFileName = slugify(`${newBook._id} ${newBook.title}.epub`, {
      lower: true,
      replacement: "-",
    });
    newBook.fileInfo.id = uniqueFileName;

    const uniqueCoverKey = slugify(`${newBook._id} ${newBook.title}.png`, {
      lower: true,
      replacement: "-",
    });

    if (uploadMethod === "aws") {
      // upload file (book | epub)
      const bookUploadCommand = new PutObjectCommand({
        Bucket: process.env.AWS_PRIVATE_BUCKET,
        Key: uniqueFileName,
        Body: fs.readFileSync(data.epubPath),
      });

      await s3Client.send(bookUploadCommand);

      // uploading covers
      const coverUploadCommand = new PutObjectCommand({
        Bucket: process.env.AWS_PUBLIC_BUCKET,
        Key: uniqueCoverKey,
        Body: fs.readFileSync(data.coverPath),
        ContentType: "image/png",
      });

      await s3Client.send(coverUploadCommand);
      const url = generateS3ClientPublicUrl(
        process.env.AWS_PUBLIC_BUCKET!,
        uniqueCoverKey
      );
      newBook.cover = { url, id: uniqueCoverKey };
    }

    if (uploadMethod === "local") {
      // Uploading Epub or Book Files
      const bookStoragePath = path.join(__dirname, "./books");

      if (!fs.existsSync(bookStoragePath)) {
        fs.mkdirSync(bookStoragePath);
      }

      const filePath = path.join(bookStoragePath, uniqueFileName);

      fs.writeFileSync(filePath, fs.readFileSync(data.epubPath));

      // Uploading Book Covers
      const { secure_url, public_id } = await cloud.uploader.upload(
        data.coverPath
      );

      newBook.cover = { id: public_id, url: secure_url };
    }

    await newBook.save();

    await AuthorModel.findByIdAndUpdate(authorId, {
      $push: { books: newBook._id },
    });
  } catch (error: any) {
    console.log(error);
  }
};

const startBulkBookCreation = async () => {
  await connectToDB();

  // Making data ready (START)
  const finalEBookPaths = generateFilePaths("./files/book");
  const finalBookCoverPaths = generateFilePaths("./files/cover");

  const booksDataPath = path.join(__dirname, "./books.json");
  const booksData = JSON.parse(
    fs.readFileSync(booksDataPath).toString()
  ) as bookData[];

  const finalData = booksData.map((data, index) => {
    return {
      ...data,
      epubPath: finalEBookPaths[index],
      coverPath: finalBookCoverPaths[index],
      publishedAt: getRandomDate(),
    };
  });

  // Making data ready (END)

  // book uploading process (START)
  console.log(`Please wait I am creating ${finalData.length} new books.`);
  const authors = await AuthorModel.find().select("_id");

  finalData.forEach(async (data, index) => {
    // Log progress
    const progress = ((index + 1) / finalData.length) * 100;
    console.log(`Progress: ${progress.toFixed(2)}%`);
    await createNewBook(data, authors[index]._id.toString());
  });

  // book uploading process (END)

  console.log("Book generation process completed.");
};

const startBulkUserCreation = async () => {
  await connectToDB();
  function createRandomUser() {
    const name = faker.person.fullName();
    return {
      name,
      email: faker.internet.email({
        firstName: name.toLowerCase(),
        provider: "email.com",
      }),
      verified: {
        on: new Date(Date.now()),
        status: true,
      },
      role: "author",
      signedUp: true,
    };
  }

  const users = faker.helpers.multiple(createRandomUser, { count: 15 });

  console.log(`Please wait I am creating ${users.length} new users/authors.`);

  users.forEach(async (user, index) => {
    // Log progress
    const progress = ((index + 1) / users.length) * 100;
    console.log(`Progress: ${progress.toFixed(2)}%`);

    const newUser = new UserModel({ ...user });
    const newAuthor = new AuthorModel({
      name: user.name,
      about: faker.lorem.sentence(50),
      userId: newUser._id,
    });

    const uniqueSlug = slugify(newAuthor.name + "-" + newAuthor._id, {
      lower: true,
      replacement: "-",
    });

    newUser.authorId = newAuthor._id as any;
    newAuthor.slug = uniqueSlug;

    await newUser.save();
    await newAuthor.save();
  });

  console.log("User generation process completed.");
};

// startBulkUserCreation();
// startBulkBookCreation();
