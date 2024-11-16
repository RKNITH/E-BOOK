import BookModel, { BookDoc } from "@/models/book";
import CartModel from "@/models/cart";
import OrderModel from "@/models/order";
import stripe from "@/stripe-local";
import { sanitizeUrl, sendErrorResponse } from "@/utils/helper";
import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import Stripe from "stripe";

type StripeLineItems = Stripe.Checkout.SessionCreateParams.LineItem[];

type options = {
  customer: Stripe.CustomerCreateParams;
  line_items: StripeLineItems;
};

const generateStripeCheckoutSession = async (options: options) => {
  const customer = await stripe.customers.create(options.customer);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    success_url: process.env.PAYMENT_SUCCESS_URL,
    cancel_url: process.env.PAYMENT_CANCEL_URL,
    line_items: options.line_items,
    customer: customer.id,
  });

  return session;
};

export const checkout: RequestHandler = async (req, res) => {
  const { cartId } = req.body;
  if (!isValidObjectId(cartId)) {
    return sendErrorResponse({ res, message: "Invalid cart id!", status: 401 });
  }

  const cart = await CartModel.findOne({
    _id: cartId,
    userId: req.user.id,
  }).populate<{
    items: { product: BookDoc; quantity: number }[];
  }>({
    path: "items.product",
  });

  if (!cart) {
    return sendErrorResponse({ res, message: "Cart not found!", status: 404 });
  }

  let invalidPurchase = false;
  for (let cartItem of cart.items) {
    if (cartItem.product.status === "unpublished") {
      invalidPurchase = true;
      break;
    }
  }

  if (invalidPurchase) {
    return sendErrorResponse({
      res,
      message: "Sorry some of the books in your cart is no longer for sale!",
      status: 403,
    });
  }

  const newOrder = await OrderModel.create({
    userId: req.user.id,
    orderItems: cart.items.map(({ product, quantity }) => {
      return {
        id: product._id,
        price: product.price.sale,
        qty: quantity,
        totalPrice: product.price.sale * quantity,
      };
    }),
  });

  // now if the cart is valid and there are products inside the cart we will send those information to the stripe and generate the payment link.
  const customer = {
    name: req.user.name,
    email: req.user.email,
    metadata: {
      userId: req.user.id,
      orderId: newOrder._id.toString(),
      type: "checkout",
    },
  };

  const line_items = cart.items.map(({ product, quantity }) => {
    const images = product.cover
      ? { images: [sanitizeUrl(product.cover.url)] }
      : {};
    return {
      quantity,
      price_data: {
        currency: "usd",
        unit_amount: product.price.sale,
        product_data: {
          name: product.title,
          ...images,
        },
      },
    };
  });

  const session = await generateStripeCheckoutSession({ customer, line_items });

  if (session.url) {
    res.json({ checkoutUrl: session.url });
  } else {
    sendErrorResponse({
      res,
      message: "Something went wrong, could not handle payment!",
      status: 500,
    });
  }
};

export const instantCheckout: RequestHandler = async (req, res) => {
  const { productId } = req.body;
  if (!isValidObjectId(productId)) {
    return sendErrorResponse({
      res,
      message: "Invalid product id!",
      status: 401,
    });
  }

  const product = await BookModel.findById(productId);

  if (!product) {
    return sendErrorResponse({
      res,
      message: "Product not found!",
      status: 404,
    });
  }

  if (product.status === "unpublished") {
    return sendErrorResponse({
      res,
      message: "Sorry this book is no longer for sale!",
      status: 403,
    });
  }

  const newOrder = await OrderModel.create({
    userId: req.user.id,
    orderItems: [
      {
        id: product._id,
        price: product.price.sale,
        qty: 1,
        totalPrice: product.price.sale,
      },
    ],
  });

  const customer = {
    name: req.user.name,
    email: req.user.email,
    metadata: {
      userId: req.user.id,
      type: "instant-checkout",
      orderId: newOrder._id.toString(),
    },
  };

  const images = product.cover
    ? { images: [sanitizeUrl(product.cover.url)] }
    : {};

  const line_items: StripeLineItems = [
    {
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: product.price.sale,
        product_data: {
          name: product.title,
          ...images,
        },
      },
    },
  ];

  const session = await generateStripeCheckoutSession({ customer, line_items });
  if (session.url) {
    res.json({ checkoutUrl: session.url });
  } else {
    sendErrorResponse({
      res,
      message: "Something went wrong, could not handle payment!",
      status: 500,
    });
  }
};
