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
    const { title, excerpt, content, category } = JSON.parse(
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
      status: "pending",
      rejectionReason: "",
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
// Update Blog
// =========================
export const updateBlog = async (req, res) => {
  try {
    const { blogId } = req.params;

    const { title, excerpt, content, category } = JSON.parse(
      req.body.blog
    );

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Blog ID",
      });
    }

    if (!title || !excerpt || !content || !category) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Only the author who created the blog can update it
    if (blog.author.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this blog",
      });
    }

    blog.title = title;
    blog.excerpt = excerpt;
    blog.content = content;
    blog.category = category;

    // If the blog was already published,
    // editing it sends it back for admin review.
    blog.status = "pending";
    blog.rejectionReason = "";

    // If a new image was uploaded
    if (req.file) {
      const fileBuffer = fs.readFileSync(req.file.path);

      const response = await imagekit.upload({
        file: fileBuffer,
        fileName: req.file.originalname,
        folder: "/blogs",
      });

      fs.unlinkSync(req.file.path);

      // Delete old image
      await imagekit.deleteFile(blog.imageFileId);

      blog.image = response.url;
      blog.imageFileId = response.fileId;
    }

    await blog.save();

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully and submitted for review",
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
      status: "approved",
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
// Get Bookmarked Blogs
// =========================
export const getBookmarkedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({
      bookmarks: req.userId,
      status: "approved",
    })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch bookmarked blogs",
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
      status: "approved",
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
    const { blog, content } = req.body;

    if (!blog || !content) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const blogExists = await Blog.findById(blog);

    if (!blogExists || !blogExists.status !== "approved") {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    await Comment.create({
      blog,
      user: req.userId,
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
    })
    .populate("user", "name")
    .sort({
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

// Get Logged In User Blogs
export const getMyBlogs = async (req, res) => {
    try {

        const blogs = await Blog.find({ author: req.userId })
            .populate("author", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            blogs
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch your blogs."
        });

    }
};

// =========================
// Toggle Bookmark
// =========================
export const toggleBookmark = async (req, res) => {
  try {
    const { blogId } = req.body;
    const userId = req.userId;

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

    const alreadyBookmarked = blog.bookmarks.includes(userId);

    if (alreadyBookmarked) {
      blog.bookmarks = blog.bookmarks.filter(
        (id) => id.toString() !== userId.toString()
      );

      await blog.save();

      return res.status(200).json({
        success: true,
        bookmarked: false,
        message: "Blog removed from bookmarks",
      });
    }

    blog.bookmarks.push(userId);

    await blog.save();

    return res.status(200).json({
      success: true,
      bookmarked: true,
      message: "Blog added to bookmarks",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// BookmarkStatus 
export const getBookmarkStatus = async (req, res) => {
  try {
    const { blogId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Blog ID",
      });
    }

    const blog = await Blog.findById(blogId).select("bookmarks");

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const bookmarked = blog.bookmarks.some(
      (userId) => userId.toString() === req.userId.toString()
    );

    return res.status(200).json({
      success: true,
      bookmarked,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};