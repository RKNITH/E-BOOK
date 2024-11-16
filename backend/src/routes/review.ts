import { addReview, getPublicReviews, getReview } from "@/controllers/reivew";
import { isAuth, isPurchasedByTheUser } from "@/middlewares/auth";
import { newReviewSchema, validate } from "@/middlewares/validator";
import { Router } from "express";

const reviewRouter = Router();

reviewRouter.post(
  "/",
  isAuth,
  validate(newReviewSchema),
  isPurchasedByTheUser,
  addReview
);
reviewRouter.get("/:bookId", isAuth, getReview);
reviewRouter.get("/list/:bookId", getPublicReviews);

export default reviewRouter;
