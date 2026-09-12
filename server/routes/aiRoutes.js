import express from "express";
import { generateContent, reviewBlog } from "../controllers/aiController.js";
import userAuth from "../middleware/userAuth.js";
import authAdmin from "../middleware/authAdmin.js";

const aiRouter = express.Router();

// Only logged-in authors can generate drafts
aiRouter.post("/generate-content", userAuth, generateContent);

// Only admins can run the AI pre-check on a submitted blog
aiRouter.post("/review-blog", authAdmin, reviewBlog);

export default aiRouter;