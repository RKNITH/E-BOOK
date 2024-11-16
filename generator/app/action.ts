"use server";

import path from "path";
import fs from "fs";
import slugify from "slugify";
import epub, { Options } from "epub-gen-memory";
import stream from "streamifier";

export const testAction = async (state: string, data: FormData) => {
  const dataList = ["title", "author", "publisher", "cover", "content"];
  const finalData: Record<string, any> = {};

  dataList.forEach((key) => {
    const value = data.get(key);

    if (key === "content") {
      finalData[key] = JSON.parse(value as string);
    } else {
      finalData[key] = value;
    }
  });
  const uploadPath = path.join(process.cwd(), "/public");
  //   if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);

  const bookFileName = `${slugify(finalData.title, {
    lower: true,
    replacement: "-",
  })}.epub`;
  const outputPath = path.join(uploadPath, bookFileName);

  const cover = finalData.cover;
  const options: Options = {
    title: finalData.title,
    author: finalData.author,
  };

  let coverAbsoluteUrl = "";
  let coverOutputPath = "";
  try {
    if (cover instanceof File) {
      const fileName = slugify(cover.name, { lower: true, replacement: "-" });
      coverAbsoluteUrl = "http://localhost:8181/" + fileName;

      const arrayBuffer = await cover.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      coverOutputPath = path.join(process.cwd(), "/public/", fileName);
      fs.writeFileSync(coverOutputPath, buffer);

      options.cover = coverAbsoluteUrl;
    }
    const file = await epub(options, finalData.content);
    fs.writeFileSync(outputPath, file);

    if (fs.existsSync(coverOutputPath)) {
      fs.unlinkSync(coverOutputPath);
    }

    return bookFileName;
  } catch (error) {
    console.log(error);
  }

  return "";
};
