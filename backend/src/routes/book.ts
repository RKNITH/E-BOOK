import {
  createNewBook,
  deleteBook,
  generateBookAccessUrl,
  getAllPurchasedBooks,
  getBookByGenre,
  getBooksPublicDetails,
  getFeaturedBooks,
  getRecommendedBooks,
  updateBook,
} from "@/controllers/book";
import { isAuth, isAuthor } from "@/middlewares/auth";
import { fileParser } from "@/middlewares/file";
import {
  newBookSchema,
  updateBookSchema,
  validate,
} from "@/middlewares/validator";
import { Router } from "express";

const bookRouter = Router();

bookRouter.post(
  "/create",
  isAuth,
  isAuthor,
  fileParser,
  validate(newBookSchema),
  createNewBook
);
bookRouter.patch(
  "/",
  isAuth,
  isAuthor,
  fileParser,
  validate(updateBookSchema),
  updateBook
);
bookRouter.get("/list", isAuth, getAllPurchasedBooks);
bookRouter.get("/details/:slug", getBooksPublicDetails);
bookRouter.get("/by-genre/:genre", getBookByGenre);
bookRouter.get("/read/:slug", isAuth, generateBookAccessUrl);
bookRouter.get("/recommended/:bookId", getRecommendedBooks);
bookRouter.get("/featured", getFeaturedBooks);
bookRouter.delete("/:bookId", isAuth, isAuthor, deleteBook);

export default bookRouter;
