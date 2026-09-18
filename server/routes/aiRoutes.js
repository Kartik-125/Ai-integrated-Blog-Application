import express from "express";
import { generateContent, reviewBlog, askQuestion } from "../controllers/aiController.js";
import userAuth from "../middleware/userAuth.js";
import authAdmin from "../middleware/authAdmin.js";
import {
  generateLimiter,
  reviewLimiter,
  askLimiter,
} from "../middleware/aiRateLimit.js";

const aiRouter = express.Router();

// Note on ordering: the limiter goes AFTER the auth middleware, so that
// req.userId is already set and the limit applies per-user.

// Only logged-in authors can generate drafts
aiRouter.post("/generate-content", userAuth, generateLimiter, generateContent);

// Only admins can run the AI pre-check on a submitted blog
aiRouter.post("/review-blog", authAdmin, reviewLimiter, reviewBlog);

// Requires login — visitors must be signed in to use the chatbot
aiRouter.post("/ask", userAuth, askLimiter, askQuestion);

export default aiRouter;