import { checkout, instantCheckout } from "@/controllers/checkout";
import { isAuth } from "@/middlewares/auth";
import { Router } from "express";

const router = Router();

router.post("/", isAuth, checkout);
router.post("/instant", isAuth, instantCheckout);

export default router;
