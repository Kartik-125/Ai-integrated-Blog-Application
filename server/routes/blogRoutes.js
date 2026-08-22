import express from "express";
import {
    createBlog,
    updateBlog,
    addComment,
    deleteBlogById,
    getAllBlogs,
    getBlogById,
    getBlogComments,
    togglePublish,
    getMyBlogs,
    toggleBookmark,
    getBookmarkedBlogs,
    getBookmarkStatus
} from "../controllers/blogController.js";

import upload from "../middleware/multer.js";
import authAdmin from "../middleware/authAdmin.js";
import userAuth from "../middleware/userAuth.js";

const blogRouter = express.Router();

// User
blogRouter.post(
    "/create",
    userAuth,
    upload.single("image"),
    createBlog
);

blogRouter.post(
    "/update/:blogId",
    userAuth,
    upload.single("image"),
    updateBlog
);

blogRouter.get(
    "/my-blogs",
    userAuth,
    getMyBlogs
);

blogRouter.post(
    "/bookmark",
    userAuth,
    toggleBookmark
);



// Admin
blogRouter.post(
    "/delete",
    authAdmin,
    deleteBlogById
);

blogRouter.post(
    "/toggle-publish",
    authAdmin,
    togglePublish
);

// Public
blogRouter.get("/all", getAllBlogs);

blogRouter.get("/bookmarks", userAuth, getBookmarkedBlogs);

blogRouter.get("/bookmark-status/:blogId", userAuth, getBookmarkStatus);

blogRouter.get("/:blogId", getBlogById);

blogRouter.post(
    "/comment",
    userAuth,
    addComment
);

blogRouter.post(
    "/comments",
    getBlogComments
);

export default blogRouter;