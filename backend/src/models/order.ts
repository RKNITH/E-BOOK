import { model, ObjectId, Schema } from "mongoose";

type OrderItem = {
  id: ObjectId;
  price: number;
  qty: number;
  totalPrice: number;
};

interface OrderDocument {
  userId: ObjectId;
  orderItems: OrderItem[];
  stripeCustomerId?: string;
  paymentId?: string;
  totalAmount?: number;
  paymentStatus?: string;
  paymentErrorMessage?: string;
  createdAt: Date;
}

const schema = new Schema<OrderDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    orderItems: [
      {
        id: { type: Schema.Types.ObjectId, ref: "Book", required: true },
        price: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
        qty: { type: Number, required: true },
      },
    ],
    stripeCustomerId: String,
    paymentId: String,
    totalAmount: Number,
    paymentStatus: String,
    paymentErrorMessage: String,
  },
  { timestamps: true }
);

const OrderModel = model<OrderDocument>("Order", schema);
export default OrderModel;
