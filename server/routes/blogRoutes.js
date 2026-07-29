    import express from "express";
    import { 
        createBlog,
        addComment,
        deleteBlogById,
        getAllBlogs,
        getBlogById,
        getBlogComments,
        togglePublish,
        getMyBlogs } from "../controllers/blogController.js";
    import upload from "../middleware/multer.js";
    import authAdmin from "../middleware/authAdmin.js";
    import userAuth from "../middleware/userAuth.js";

    const blogRouter = express.Router();

    // Admin
    blogRouter.post("/create", userAuth, upload.single("image"), createBlog);

    blogRouter.get("/my-blogs", userAuth, getMyBlogs);

    blogRouter.post("/delete", authAdmin, deleteBlogById);

    blogRouter.post("/toggle-publish", authAdmin, togglePublish);

    // Public
    blogRouter.get("/all", getAllBlogs);

    blogRouter.get("/:blogId", getBlogById);

    blogRouter.post("/comment", userAuth ,addComment);

    blogRouter.post("/comments", getBlogComments);

    export default blogRouter;

