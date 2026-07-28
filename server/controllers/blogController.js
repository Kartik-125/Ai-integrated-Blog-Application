import fs from "fs";
import imagekit from "../configs/imageKit.js";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import mongoose from "mongoose";

// =========================
// Create Blog
// =========================
export const createBlog = async (req, res) => {
  try {
    const { title, excerpt, content, category, isPublished } = JSON.parse(
      req.body.blog
    );

    const imageFile = req.file;

    if (!title || !excerpt || !content || !category || !imageFile) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Read uploaded image
    const fileBuffer = fs.readFileSync(imageFile.path);

    // Upload image to ImageKit
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/blogs",
    });

    // Delete temporary image
    fs.unlinkSync(imageFile.path);

    const image = response.url;
    const imageFileId = response.fileId;

    // Generate slug
    let slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    // Make slug unique
    const existingSlug = await Blog.findOne({ slug });

    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    // Save blog
    const blog = await Blog.create({
      title,
      excerpt,
      content,
      category,
      image,
      imageFileId,
      author: req.userId,
      slug,
      isPublished,
    });

    return res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Get All Published Blogs
// =========================
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({
      isPublished: true,
    })
      .populate("author", "name")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Get Blog By Id
// =========================
export const getBlogById = async (req, res) => {
  try {
    const { blogId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Blog ID",
      });
    }

    const blog = await Blog.findOne({
      _id: blogId,
      isPublished: true,
    }).populate("author", "name email");

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    blog.views += 1;
    await blog.save();

    return res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Delete Blog
// =========================
export const deleteBlogById = async (req, res) => {
  try {
    const { blogId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Blog ID",
      });
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Delete image from ImageKit
    await imagekit.deleteFile(blog.imageFileId);

    // Delete blog
    await Blog.findByIdAndDelete(blogId);

    // Delete comments
    await Comment.deleteMany({
      blog: blogId,
    });

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Publish / Unpublish Blog
// =========================
export const togglePublish = async (req, res) => {
  try {
    const { id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Blog ID",
      });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    blog.isPublished = !blog.isPublished;

    await blog.save();

    return res.status(200).json({
      success: true,
      message: "Blog status updated",
      isPublished: blog.isPublished,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Add Comment
// =========================
export const addComment = async (req, res) => {
  try {
    const { blog, name, content } = req.body;

    if (!blog || !name || !content) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const blogExists = await Blog.findById(blog);

    if (!blogExists || !blogExists.isPublished) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    await Comment.create({
      blog,
      name,
      content,
    });

    return res.status(201).json({
      success: true,
      message: "Comment added for review",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Get Approved Comments
// =========================
export const getBlogComments = async (req, res) => {
  try {
    const { blogId } = req.body;

    const comments = await Comment.find({
      blog: blogId,
      isApproved: true,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};