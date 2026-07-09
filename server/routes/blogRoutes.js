    import express from "express";
    import { addBlog, addComment, deleteBlogById, getAllBlogs, getBlogById, getBlogComments, togglePublish } from "../controllers/blogController.js";
    import upload from "../middleware/multer.js";
    import auth from "../middleware/auth.js";

    const blogRouter = express.Router();

    // Admin
    blogRouter.post("/add", auth, upload.single("image"), addBlog);

    blogRouter.post("/delete", auth, deleteBlogById);

    blogRouter.post("/toggle-publish", auth, togglePublish);

    // Public
    blogRouter.get("/all", getAllBlogs);

    blogRouter.get("/:blogId", getBlogById);

    blogRouter.post("/add-comment", addComment);

    blogRouter.post("/comments", getBlogComments);

    export default blogRouter;

