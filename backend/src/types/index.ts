import {
  cartItemsSchema,
  historyValidationSchema,
  newAuthorSchema,
  newBookSchema,
  newReviewSchema,
  updateBookSchema,
} from "@/middlewares/validator";
import { RequestHandler } from "express";
import { z } from "zod";

type AuthorHandlerBody = z.infer<typeof newAuthorSchema>;
type NewBookBody = z.infer<typeof newBookSchema>;
type UpdateBookBody = z.infer<typeof updateBookSchema>;
type AddReviewBody = z.infer<typeof newReviewSchema>;
type BookHistoryBody = z.infer<typeof historyValidationSchema>;
type CartBody = z.infer<typeof cartItemsSchema>;

type PurchasedByTheUserBody = { bookId: string };

export type IsPurchasedByTheUserHandler = RequestHandler<
  {},
  {},
  PurchasedByTheUserBody
>;
export type RequestAuthorHandler = RequestHandler<{}, {}, AuthorHandlerBody>;
export type CreateBookRequestHandler = RequestHandler<{}, {}, NewBookBody>;
export type UpdateBookRequestHandler = RequestHandler<{}, {}, UpdateBookBody>;
export type AddReviewRequestHandler = RequestHandler<{}, {}, AddReviewBody>;
export type UpdateHistoryRequestHandler = RequestHandler<
  {},
  {},
  BookHistoryBody
>;
export type CartRequestHandler = RequestHandler<{}, {}, CartBody>;
