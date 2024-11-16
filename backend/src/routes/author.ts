import {
  getAuthorDetails,
  getBooks,
  registerAuthor,
  updateAuthor,
} from "@/controllers/author";
import { isAuth, isAuthor } from "@/middlewares/auth";
import { newAuthorSchema, validate } from "@/middlewares/validator";
import { Router } from "express";

const authorRouter = Router();

authorRouter.post(
  "/register",
  isAuth,
  validate(newAuthorSchema),
  registerAuthor
);
authorRouter.patch(
  "/",
  isAuth,
  isAuthor,
  validate(newAuthorSchema),
  updateAuthor
);
authorRouter.get("/books/:authorId", isAuth, getBooks);
authorRouter.get("/:id", getAuthorDetails);

export default authorRouter;
