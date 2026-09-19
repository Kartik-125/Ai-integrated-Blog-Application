import express from "express";
import { generateContent, reviewBlog, askQuestion } from "../controllers/aiController.js";
import userAuth from "../middleware/userAuth.js";
import authAdmin from "../middleware/authAdmin.js";
import { validate } from "../middleware/validate.js";
import {
  generateContentSchema,
  reviewBlogSchema,
  askQuestionSchema,
} from "../validation/schemas.js";
import {
  generateLimiter,
  reviewLimiter,
  askLimiter,
} from "../middleware/aiRateLimit.js";

const aiRouter = express.Router();

// Note on ordering: the limiter goes AFTER the auth middleware, so that
// req.userId is already set and the limit applies per-user. Validation
// goes before the limiter — no point rate-limiting a request that's
// going to be rejected as malformed anyway.

// Only logged-in authors can generate drafts
aiRouter.post(
  "/generate-content",
  userAuth,
  validate(generateContentSchema),
  generateLimiter,
  generateContent
);

// Only admins can run the AI pre-check on a submitted blog
aiRouter.post(
  "/review-blog",
  authAdmin,
  validate(reviewBlogSchema),
  reviewLimiter,
  reviewBlog
);

// Requires login — visitors must be signed in to use the chatbot
aiRouter.post(
  "/ask",
  userAuth,
  validate(askQuestionSchema),
  askLimiter,
  askQuestion
);

export default aiRouter;