import express from 'express'
import { 
    adminLogin,
    getAllBlogsAdmin,
    approveCommentById,
    getDashboard,
    deleteCommentById,
    getAllComments,
    approveBlog,
    rejectBlog,
    getBlogByIdAdmin, 
    } from '../controllers/adminController.js';
import authAdmin from '../middleware/authAdmin.js';
import { validate } from '../middleware/validate.js';
import { adminLoginSchema, rejectBlogSchema } from '../validation/schemas.js';

const adminRouter = express.Router();

adminRouter.post("/login", validate(adminLoginSchema), adminLogin);

adminRouter.get("/blogs", authAdmin, getAllBlogsAdmin);

adminRouter.get("/blogs/:id", authAdmin, getBlogByIdAdmin);

adminRouter.post("/approve-blog", authAdmin, approveBlog);

adminRouter.post("/reject-blog", authAdmin, validate(rejectBlogSchema), rejectBlog);

adminRouter.get("/comments", authAdmin, getAllComments);

adminRouter.get("/dashboard", authAdmin, getDashboard);

adminRouter.post("/delete-comment", authAdmin, deleteCommentById);

adminRouter.post("/approve-comment", authAdmin, approveCommentById);

export default adminRouter;