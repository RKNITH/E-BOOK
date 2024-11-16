import { handlePayment } from "@/controllers/payment";
import express, { Router } from "express";

const webhookRouter = Router();

webhookRouter.post(
  "/",
  express.raw({ type: "application/json" }),
  handlePayment
);

export default webhookRouter;
