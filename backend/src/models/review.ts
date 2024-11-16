import { Model, ObjectId, Schema, model } from "mongoose";

interface ReviewDoc {
  user: ObjectId;
  book: ObjectId;
  rating: number;
  content?: string;
  createdAt: Date;
}

const reviewSchema = new Schema<ReviewDoc>(
  {
    user: {
      type: Schema.ObjectId,
      ref: "User",
      required: true,
    },
    book: {
      type: Schema.ObjectId,
      ref: "Book",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    content: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const ReviewModel = model("Review", reviewSchema);
export default ReviewModel as Model<ReviewDoc>;
