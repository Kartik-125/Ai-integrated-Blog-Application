import express from "express";

import {
  registerUser,
  loginUser,
  getUserProfile,
  forgotPassword,
  resetPassword
} from "../controllers/userController.js";

import userAuth from "../middleware/userAuth.js";

const userRouter = express.Router();

// Register User
userRouter.post("/register", registerUser);

// Login User
userRouter.post("/login", loginUser);

// Get User Profile
userRouter.get("/profile", userAuth, getUserProfile);

// Forgot Password
userRouter.post("/forgot-password", forgotPassword);

// Reset Password
userRouter.post("/reset-password/:token", resetPassword);

export default userRouter;