import { getBookHistory, updateBookHistory } from "@/controllers/history";
import { isAuth, isPurchasedByTheUser } from "@/middlewares/auth";
import { historyValidationSchema, validate } from "@/middlewares/validator";
import { Router } from "express";

const historyRouter = Router();

historyRouter.post(
  "/",
  isAuth,
  validate(historyValidationSchema),
  isPurchasedByTheUser,
  updateBookHistory
);
historyRouter.get("/:bookId", isAuth, getBookHistory);

export default historyRouter;
