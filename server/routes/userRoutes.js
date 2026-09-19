import express from "express";

import {
  registerUser,
  loginUser,
  getUserProfile,
  forgotPassword,
  resetPassword
} from "../controllers/userController.js";

import userAuth from "../middleware/userAuth.js";
import { validate } from "../middleware/validate.js";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validation/schemas.js";

const userRouter = express.Router();

// Register User
userRouter.post("/register", validate(registerSchema), registerUser);

// Login User
userRouter.post("/login", validate(loginSchema), loginUser);

// Get User Profile
userRouter.get("/profile", userAuth, getUserProfile);

// Forgot Password
userRouter.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);

// Reset Password
userRouter.post("/reset-password/:token", validate(resetPasswordSchema), resetPassword);

export default userRouter;