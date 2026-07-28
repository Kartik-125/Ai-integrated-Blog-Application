    import express from "express";
    import { 
        createBlog,
        addComment,
        deleteBlogById,
        getAllBlogs,
        getBlogById,
        getBlogComments,
        togglePublish } from "../controllers/blogController.js";
    import upload from "../middleware/multer.js";
    import auth from "../middleware/auth.js";
    import userAuth from "../middleware/userAuth.js";

    const blogRouter = express.Router();

    // Admin
    blogRouter.post("/create", userAuth, upload.single("image"), createBlog);

    blogRouter.post("/delete", auth, deleteBlogById);

    blogRouter.post("/toggle-publish", auth, togglePublish);

    // Public
    blogRouter.get("/all", getAllBlogs);

    blogRouter.get("/:blogId", getBlogById);

    blogRouter.post("/comment", addComment);

    blogRouter.post("/comments", getBlogComments);

    export default blogRouter;

