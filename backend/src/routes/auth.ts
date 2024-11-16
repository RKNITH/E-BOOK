import {
  generateAuthLink,
  logout,
  sendProfileInfo,
  updateProfile,
  verifyAuthToken,
} from "@/controllers/auth";
import { isAuth } from "@/middlewares/auth";
import { fileParser } from "@/middlewares/file";
import {
  emailValidationSchema,
  newUserSchema,
  validate,
} from "@/middlewares/validator";
import { Router } from "express";

const authRouter = Router();

authRouter.post(
  "/generate-link",
  validate(emailValidationSchema),
  generateAuthLink
);
authRouter.get("/verify", verifyAuthToken);
authRouter.get("/profile", isAuth, sendProfileInfo);
authRouter.post("/logout", isAuth, logout);
authRouter.put(
  "/profile",
  isAuth,
  fileParser,
  validate(newUserSchema),
  updateProfile
);

export default authRouter;
