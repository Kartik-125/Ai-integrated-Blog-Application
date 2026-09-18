import jwt from 'jsonwebtoken'
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';
import mongoose from 'mongoose';
import { indexBlog } from '../utils/indexBlog.js';
import { asyncHandler, ApiError } from '../utils/asyncHandler.js';

// =========================
// ADMIN LOGIN
// =========================
// NOTE: kept as a plain success:false response here rather than
// `throw new ApiError(...)`. The admin Login.jsx component's catch
// block only shows a generic toast — it doesn't read
// error.response.data.message the way AdminBlogReview.jsx does — so
// throwing would silently downgrade "Invalid Credentials" into
// "Something went wrong". This stays as-is on purpose.
export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.json({
      success: false,
      message: "Invaild Credentials",
    });
  }

  const token = jwt.sign(
    {
      email,
      type: "admin",
    },
    process.env.ADMIN_JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return res.json({
    success: true,
    token,
  });
});

// =========================
// GET ALL BLOGS (ADMIN)
// =========================
export const getAllBlogsAdmin = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({}).sort({
    createdAt: -1,
  });

  return res.status(200).json({
    success: true,
    blogs,
  });
});

// =========================
// Get Blog By ID - Admin Review
// =========================
export const getBlogByIdAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Blog ID");
  }

  const blog = await Blog.findById(id).populate("author", "name email");

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  return res.status(200).json({
    success: true,
    blog,
  });
});

// =========================
// DASHBOARD
// =========================
export const getDashboard = asyncHandler(async (req, res) => {
  const recentBlogs = await Blog.find({})
    .sort({
      createdAt: -1,
    })
    .limit(5);

  const blogs = await Blog.countDocuments();

  const comments = await Comment.countDocuments();

  const pending = await Blog.countDocuments({
    status: "pending",
  });

  const dashboardData = {
    blogs,
    comments,
    pending,
    recentBlogs,
  };

  return res.status(200).json({
    success: true,
    dashboardData,
  });
});

// =========================
// Approve Blog
// =========================
export const approveBlog = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Blog ID");
  }

  const blog = await Blog.findById(id);

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  blog.status = "approved";
  blog.rejectionReason = "";

  await blog.save();

  // Index the blog for the RAG chatbot. Wrapped in its own try/catch
  // so that if Gemini's embedding call fails (rate limit, network
  // blip, etc.) the approval itself still succeeds — indexing is an
  // enhancement on top of approval, not a required part of it.
  try {
    await indexBlog(blog);
  } catch (indexError) {
    console.error("Blog indexing failed:", indexError);
  }

  return res.status(200).json({
    success: true,
    message: "Blog approved successfully",
  });
});

// =========================
// REJECT BLOG
// =========================
export const rejectBlog = asyncHandler(async (req, res) => {
  const { id, reason } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Blog ID");
  }

  if (!reason || !reason.trim()) {
    throw new ApiError(400, "Rejection reason is required");
  }

  const blog = await Blog.findById(id);

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  blog.status = "rejected";
  blog.rejectionReason = reason.trim();

  await blog.save();

  return res.status(200).json({
    success: true,
    message: "Blog rejected successfully",
  });
});

// =========================
// GET ALL COMMENTS
// =========================
export const getAllComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({})
    .populate("blog")
    .populate("user", "name email")
    .sort({
      createdAt: -1,
    });

  return res.status(200).json({
    success: true,
    comments,
  });
});

// =========================
// DELETE COMMENT
// =========================
export const deleteCommentById = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Comment ID");
  }

  const comment = await Comment.findById(id);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  await Comment.findByIdAndDelete(id);

  return res.status(200).json({
    success: true,
    message: "Comment deleted successfully",
  });
});

// =========================
// APPROVE COMMENT
// =========================
export const approveCommentById = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Comment ID");
  }

  const comment = await Comment.findById(id);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  comment.isApproved = true;

  await comment.save();

  return res.status(200).json({
    success: true,
    message: "Comment approved successfully",
  });
});