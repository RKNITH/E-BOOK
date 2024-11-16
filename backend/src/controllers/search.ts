import BookModel from "@/models/book";
import { formatBook, sendErrorResponse } from "@/utils/helper";
import { RequestHandler } from "express";

export const searchBooks: RequestHandler = async (req, res) => {
  const { title } = req.query;

  if (typeof title !== "string" || title?.trim().length < 3)
    return sendErrorResponse({
      message: "Invalid search query!",
      res,
      status: 422,
    });

  const results = await BookModel.find({
    title: { $regex: title, $options: "i" },
  });

  res.json({ results: results.map(formatBook) });
};
