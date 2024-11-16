import BookModel, { BookDoc } from "@/models/book";
import { CreateBookRequestHandler, UpdateBookRequestHandler } from "@/types";
import {
  formatBook,
  formatFileSize,
  generateS3ClientPublicUrl,
  sendErrorResponse,
} from "@/utils/helper";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { isValidObjectId, ObjectId, Types } from "mongoose";
import slugify from "slugify";
import fs from "fs";
import s3Client from "@/cloud/aws";
import {
  generateFileUploadUrl,
  uploadBookToAws,
  uploadBookToLocalDir,
  uploadCoverToCloudinary,
} from "@/utils/fileUpload";
import AuthorModel from "@/models/author";
import path from "path";
import cloudinary from "@/cloud/cludinary";
import { RequestHandler } from "express";
import UserModel from "@/models/user";
import HistoryModel, { Settings } from "@/models/history";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const createNewBook: CreateBookRequestHandler = async (req, res) => {
  const { body, files, user } = req;

  const {
    title,
    description,
    genre,
    language,
    fileInfo,
    price,
    publicationName,
    publishedAt,
    uploadMethod,
    status,
  } = body;

  const { cover, book } = files;

  const newBook = new BookModel<BookDoc>({
    title,
    description,
    genre,
    language,
    fileInfo: { size: formatFileSize(fileInfo.size), id: "" },
    price,
    publicationName,
    publishedAt,
    slug: "",
    author: new Types.ObjectId(user.authorId),
    status,
    copySold: 0,
  });

  let fileUploadUrl = "";

  newBook.slug = slugify(`${newBook.title} ${newBook._id}`, {
    lower: true,
    replacement: "-",
  });

  const fileName = slugify(`${newBook._id} ${newBook.title}.epub`, {
    lower: true,
    replacement: "-",
  });

  if (uploadMethod === "local") {
    // if you are not using AWS use the following logic
    if (
      !book ||
      Array.isArray(book) ||
      book.mimetype !== "application/epub+zip"
    ) {
      return sendErrorResponse({
        message: "Invalid book file!",
        status: 422,
        res,
      });
    }

    if (cover && !Array.isArray(cover) && cover.mimetype?.startsWith("image")) {
      // if you are using cloudinary use this method
      newBook.cover = await uploadCoverToCloudinary(cover);
    }

    uploadBookToLocalDir(book, fileName);
  }

  if (uploadMethod === "aws") {
    // if you are using AWS use the following logic
    fileUploadUrl = await generateFileUploadUrl(s3Client, {
      bucket: process.env.AWS_PRIVATE_BUCKET!,
      contentType: fileInfo.type,
      uniqueKey: fileName,
    });

    // this will upload cover to the cloud
    if (cover && !Array.isArray(cover) && cover.mimetype?.startsWith("image")) {
      const uniqueFileName = slugify(`${newBook._id} ${newBook.title}.png`, {
        lower: true,
        replacement: "-",
      });

      newBook.cover = await uploadBookToAws(cover.filepath, uniqueFileName);
    }
  }

  newBook.fileInfo.id = fileName;
  await AuthorModel.findByIdAndUpdate(user.authorId, {
    $push: {
      books: newBook._id,
    },
  });
  await newBook.save();

  await UserModel.findByIdAndUpdate(req.user.id, {
    $push: { books: newBook._id },
  });
  res.json({ fileUploadUrl, slug: newBook.slug });
};

export const updateBook: UpdateBookRequestHandler = async (req, res) => {
  const { body, files, user } = req;

  const {
    title,
    description,
    genre,
    language,
    fileInfo,
    price,
    publicationName,
    publishedAt,
    uploadMethod,
    slug,
    status,
  } = body;

  const { cover, book: newBookFile } = files;

  const book = await BookModel.findOne({
    slug,
    author: user.authorId,
  });

  if (!book) {
    return sendErrorResponse({
      message: "Book not found!",
      status: 404,
      res,
    });
  }

  book.title = title;
  book.description = description;
  book.language = language;
  book.publicationName = publicationName;
  book.genre = genre;
  book.publishedAt = publishedAt;
  book.price = price;
  book.status = status;

  if (uploadMethod === "local") {
    if (
      newBookFile &&
      !Array.isArray(newBookFile) &&
      newBookFile.mimetype === "application/epub+zip"
    ) {
      // remove old book file (epub) from storage
      const uploadPath = path.join(__dirname, "../books");
      const oldFilePath = path.join(uploadPath, book.fileInfo.id);

      if (!fs.existsSync(oldFilePath))
        return sendErrorResponse({
          message: "Book file not found!",
          status: 404,
          res,
        });

      fs.unlinkSync(oldFilePath);

      // add new book to the storage
      const newFileName = slugify(`${book._id} ${book.title}`, {
        lower: true,
        replacement: "-",
      });
      const newFilePath = path.join(uploadPath, newFileName);
      const file = fs.readFileSync(newBookFile.filepath);
      fs.writeFileSync(newFilePath, file);

      book.fileInfo = {
        id: newFileName,
        size: formatFileSize(fileInfo?.size || newBookFile.size),
      };
    }

    if (cover && !Array.isArray(cover) && cover.mimetype?.startsWith("image")) {
      // remove old cover file if exists
      if (book.cover?.id) {
        await cloudinary.uploader.destroy(book.cover.id);
      }
      book.cover = await uploadCoverToCloudinary(cover);
    }
  }

  let fileUploadUrl = "";
  if (uploadMethod === "aws") {
    if (fileInfo?.type === "application/epub+zip") {
      // remove the old book from cloud (bucket)
      const deleteCommand = new DeleteObjectCommand({
        Bucket: process.env.AWS_PRIVATE_BUCKET,
        Key: book.fileInfo.id,
      });

      await s3Client.send(deleteCommand);

      // generate (sign) new url to upload book
      const fileName = slugify(`${book._id} ${book.title}.epub`, {
        lower: true,
        replacement: "-",
      });
      fileUploadUrl = await generateFileUploadUrl(s3Client, {
        bucket: process.env.AWS_PRIVATE_BUCKET!,
        contentType: fileInfo?.type,
        uniqueKey: fileName,
      });

      book.fileInfo = { id: fileName, size: formatFileSize(fileInfo.size) };
    }

    if (cover && !Array.isArray(cover) && cover.mimetype?.startsWith("image")) {
      // remove old cover from the cloud (bucket)
      if (book.cover?.id) {
        const deleteCommand = new DeleteObjectCommand({
          Bucket: process.env.AWS_PUBLIC_BUCKET,
          Key: book.cover.id,
        });
        await s3Client.send(deleteCommand);
      }
      // upload new cover to the cloud (bucket)
      const uniqueFileName = slugify(`${book._id} ${book.title}.png`, {
        lower: true,
        replacement: "-",
      });

      book.cover = await uploadBookToAws(cover.filepath, uniqueFileName);
    }
  }

  await book.save();

  // we are trying to make our app backward compatible
  if (!user.books?.includes(book._id.toString())) {
    await UserModel.findByIdAndUpdate(user.id, {
      $push: { books: book._id },
    });
  }

  res.send(fileUploadUrl);
};

interface PopulatedBooks {
  cover?: {
    url: string;
    id: string;
  };
  _id: ObjectId;
  author: {
    _id: ObjectId;
    name: string;
    slug: string;
  };
  title: string;
  slug: string;
}

export const getAllPurchasedBooks: RequestHandler = async (req, res) => {
  const user = await UserModel.findById(req.user.id).populate<{
    books: PopulatedBooks[];
  }>({
    path: "books",
    select: "author title cover slug",
    populate: { path: "author", select: "slug name" },
  });

  if (!user) return res.json({ books: [] });

  res.json({
    books: user.books.map((book) => ({
      id: book._id,
      title: book.title,
      cover: book.cover?.url,
      slug: book.slug,
      author: {
        name: book.author.name,
        slug: book.author.slug,
        id: book.author._id,
      },
    })),
  });
};

export const getBooksPublicDetails: RequestHandler = async (req, res) => {
  const book = await BookModel.findOne({ slug: req.params.slug }).populate<{
    author: PopulatedBooks["author"];
  }>({
    path: "author",
    select: "name slug",
  });

  if (!book)
    return sendErrorResponse({
      status: 404,
      message: "Book not found!",
      res,
    });

  const {
    _id,
    title,
    cover,
    author,
    slug,
    description,
    genre,
    language,
    publishedAt,
    publicationName,
    price: { mrp, sale },
    fileInfo,
    averageRating,
    status,
  } = book;

  res.json({
    book: {
      id: _id,
      title,
      genre,
      status,
      language,
      slug,
      description,
      publicationName,
      fileInfo,
      publishedAt: publishedAt.toISOString().split("T")[0],
      cover: cover?.url,
      rating: averageRating?.toFixed(1),
      price: {
        mrp: (mrp / 100).toFixed(2), // $1 100C/100 = $1
        sale: (sale / 100).toFixed(2), // 1.50
      },
      author: {
        id: author._id,
        name: author.name,
        slug: author.slug,
      },
    },
  });
};

export const getBookByGenre: RequestHandler = async (req, res) => {
  const books = await BookModel.find({
    genre: req.params.genre,
    status: { $ne: "unpublished" },
  }).limit(5);

  books.map(formatBook);
  res.json({
    books: books.map(formatBook),
  });
};

export const generateBookAccessUrl: RequestHandler = async (req, res) => {
  const { slug } = req.params;

  const book = await BookModel.findOne({ slug });
  if (!book)
    return sendErrorResponse({ res, message: "Book not found!", status: 404 });

  const user = await UserModel.findOne({ _id: req.user.id, books: book._id });
  if (!user)
    return sendErrorResponse({ res, message: "User not found!", status: 404 });

  const history = await HistoryModel.findOne({
    reader: req.user.id,
    book: book._id,
  });

  const settings: Settings = {
    lastLocation: "",
    highlights: [],
  };

  if (history) {
    settings.highlights = history.highlights.map((h) => ({
      fill: h.fill,
      selection: h.selection,
    }));
    settings.lastLocation = history.lastLocation;
  }

  // generate access url if you are using aws
  const bookGetCommand = new GetObjectCommand({
    Bucket: process.env.AWS_PRIVATE_BUCKET,
    Key: book.fileInfo.id,
  });
  const accessUrl = await getSignedUrl(s3Client, bookGetCommand);

  res.json({ settings, url: accessUrl });
};

interface RecommendedBooks {
  id: string;
  title: string;
  genre: string;
  slug: string;
  cover?: string;
  rating?: string;
  price: {
    mrp: string;
    sale: string;
  };
}

export interface AggregationResult {
  _id: ObjectId;
  title: string;
  genre: string;
  price: {
    mrp: number;
    sale: number;
    _id: ObjectId;
  };
  cover?: {
    url: string;
    id: string;
    _id: ObjectId;
  };
  slug: string;
  averageRating?: number;
}

export const getRecommendedBooks: RequestHandler = async (req, res) => {
  const { bookId } = req.params;

  if (!isValidObjectId(bookId)) {
    return sendErrorResponse({ message: "Invalid book id!", res, status: 422 });
  }

  const book = await BookModel.findById(bookId);
  if (!book) {
    return sendErrorResponse({ message: "Book not found!", res, status: 404 });
  }

  const recommendedBooks = await BookModel.aggregate<AggregationResult>([
    {
      $match: {
        genre: book.genre,
        _id: { $ne: book._id },
        status: { $ne: "unpublished" },
      },
    },
    {
      $lookup: {
        localField: "_id",
        from: "reviews",
        foreignField: "book",
        as: "reviews",
      },
    },
    {
      $addFields: {
        averageRating: { $avg: "$reviews.rating" },
      },
    },
    {
      $sort: { averageRating: -1 },
    },
    {
      $limit: 5,
    },
    {
      $project: {
        _id: 1,
        title: 1,
        slug: 1,
        genre: 1,
        price: 1,
        cover: 1,
        averageRating: 1,
      },
    },
  ]);

  const result = recommendedBooks.map<RecommendedBooks>(formatBook);

  res.json(result);
};

export const getFeaturedBooks: RequestHandler = async (req, res) => {
  const books = [
    {
      title: "Murder on the Orient Express",
      slogan: "Unravel the mystery, ride the Orient Express!",
      subtitle: "A thrilling journey through intrigue and deception.",
      cover:
        "https://ebook-public-data.s3.amazonaws.com/669e469bf094674648c4cac8-murder-on-the-orient-express.png",
      slug: "murder-on-the-orient-express-669e469bf094674648c4cac8",
    },
    {
      title: "To Kill a Mockingbird",
      slogan: "Discover courage in a small town.",
      subtitle: "A timeless tale of justice and compassion.",
      cover:
        "https://ebook-public-data.s3.amazonaws.com/669e469bf094674648c4cac9-to-kill-a-mockingbird.png",
      slug: "to-kill-a-mockingbird-669e469bf094674648c4cac9",
    },
    {
      title: "The Girl with the Dragon Tattoo",
      slogan: "Uncover secrets with the girl and her tattoo.",
      subtitle: "A gripping thriller of mystery and revenge.",
      cover:
        "https://ebook-public-data.s3.amazonaws.com/669e469bf094674648c4cad3-the-girl-with-the-dragon-tattoo.png",
      slug: "the-girl-with-the-dragon-tattoo-669e469bf094674648c4cad3",
    },
    {
      title: "The Hunger Games",
      slogan: "Survive the games, ignite the rebellion.",
      subtitle: "An epic adventure of survival and resilience.",
      cover:
        "https://ebook-public-data.s3.amazonaws.com/669e469bf094674648c4cad4-the-hunger-games.png",
      slug: "the-hunger-games-669e469bf094674648c4cad4",
    },
  ];

  res.json({ featuredBooks: books });
};

export const deleteBook: RequestHandler = async (req, res) => {
  const { bookId } = req.params;
  const { user } = req;
  const deleteMethodAddedDate = 1722704247287;

  if (!isValidObjectId(bookId)) {
    return sendErrorResponse({ message: "Invalid book id!", res, status: 422 });
  }

  const book = await BookModel.findOne({ _id: bookId, author: user.authorId });
  if (!book) {
    return sendErrorResponse({ message: "Book not found!", res, status: 404 });
  }

  const bookCreationTime = book._id.getTimestamp().getTime();
  if (deleteMethodAddedDate >= bookCreationTime) {
    return res.json({ success: false });
  }

  if (book.copySold >= 1) {
    return res.json({ success: false });
  }

  await BookModel.findByIdAndDelete(book._id);
  const author = await AuthorModel.findById(user.authorId);
  if (author) {
    author.books = author.books.filter((id) => id.toString() !== bookId);
    await author.save();
  }

  const coverId = book.cover?.id;
  const bookFileId = book.fileInfo.id;

  if (coverId) {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.AWS_PUBLIC_BUCKET,
      Key: coverId,
    });
    await s3Client.send(deleteCommand);
  }

  if (bookFileId) {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.AWS_PRIVATE_BUCKET,
      Key: bookFileId,
    });
    await s3Client.send(deleteCommand);
  }

  res.json({ success: true });
};
