import express from "express";
import { addBlog } from "../controllers/blogController.js";
import upload from "../middleware/multer";
import auth from "../middleware/auth";

const blogRouter = express.Router();

blogRouter.post("/add", upload.single('image'), auth, addBlog)

export default blogRouter;

