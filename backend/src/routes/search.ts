import { searchBooks } from "@/controllers/search";
import { Router } from "express";

const searchRouter = Router();

searchRouter.get("/books", searchBooks);

export default searchRouter;
