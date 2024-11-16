import "express-async-errors";
import "@/db/connect";
import express, { ErrorRequestHandler } from "express";
import path from "path";
import cors from "cors";
import morgan from "morgan";

import cookieParser from "cookie-parser";
import authRouter from "./routes/auth";
import { errorHandler } from "./middlewares/error";
import { fileParser } from "./middlewares/file";
import authorRouter from "./routes/author";
import bookRouter from "./routes/book";
import formidable from "formidable";
import reviewRouter from "./routes/review";
import ReviewModel from "./models/review";
import { Types } from "mongoose";
import historyRouter from "./routes/history";
import { isAuth, isValidReadingRequest } from "./middlewares/auth";
import cartRouter from "./routes/cart";
import checkoutRouter from "./routes/checkout";
import webhookRouter from "./routes/webhook";
import orderRouter from "./routes/order";
import searchRouter from "./routes/search";

const app = express();

const publicPath = path.join(__dirname, "./books");

// app.use((req, res, next) => {
//   req.on("data", (chunk) => {
//     req.body = JSON.parse(chunk);
//     next();
//   });
// });
app.use(morgan("dev"));
app.use(
  cors({
    origin: [process.env.APP_URL!, process.env.APP_URL_2!],
    credentials: true,
  })
);
app.use("/webhook", webhookRouter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/books", isAuth, isValidReadingRequest, express.static(publicPath));

app.use("/auth", authRouter);
app.use("/author", authorRouter);
app.use("/book", bookRouter);
app.use("/review", reviewRouter);
app.use("/history", historyRouter);
app.use("/cart", cartRouter);
app.use("/checkout", checkoutRouter);
app.use("/order", orderRouter);
app.use("/search", searchRouter);

app.get("/test", async (req, res) => {
  const [result] = await ReviewModel.aggregate<{ averageRating: number }>([
    {
      $match: {
        book: new Types.ObjectId("66547159a5bf5a163af3f049"),
      },
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  res.json({ review: result.averageRating.toFixed(1) });
});

app.use(errorHandler);

const port = process.env.PORT || 8989;

app.listen(port, () => {
  console.log(`The application is running on port http://localhost:${port}`);
});
