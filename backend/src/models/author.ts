import { Model, ObjectId, Schema, model } from "mongoose";

interface AuthorDoc {
  userId: ObjectId;
  name: string;
  about: string;
  slug: string;
  socialLinks: string[];
  books: ObjectId[];
}

const authorSchema = new Schema<AuthorDoc>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    about: {
      type: String,
      required: true,
      trim: true,
    },
    socialLinks: [String],
    books: [
      {
        type: Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const AuthorModel = model("Author", authorSchema);
export default AuthorModel as Model<AuthorDoc>;
