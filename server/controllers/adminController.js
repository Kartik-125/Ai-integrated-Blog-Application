import jwt from 'jsonwebtoken'
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';
import mongoose from 'mongoose';

// =========================
// ADMIN LOGIN
// =========================

export const adminLogin = async (req,res)=>{

    try{
        const {email, password} = req.body;

        if(
            email !== process.env.ADMIN_EMAIL || 
            password !== process.env.ADMIN_PASSWORD
        ) {
            return res.json({
                success: false, 
                message :"Invaild Credentials"
            });
        }

        const token = jwt.sign(
            {
                email,
                type: "admin",
            }, 
            process.env.ADMIN_JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({
            success: true, 
            token
        });
    } catch(error){
        res.json({
            success: false, 
            message: error.message
        });
    }
};

// =========================
// GET ALL BLOGS (ADMIN)
// =========================

export const getAllBlogsAdmin = async (req, res)=> {
    try{
        const blogs = await Blog.find({}).sort({
            createdAt: -1
        });

        res.json({
            success: true,
            blogs
        });
    } catch(error){
        res.json({
            success: false,
            message: error.message
        });
    }
};

// =========================
// Get Blog By ID - Admin Review
// =========================
export const getBlogByIdAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Blog ID",
      });
    }

    const blog = await Blog.findById(id)
      .populate("author", "name email");

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      success: true,
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
// DASHBOARD
// =========================

export const getDashboard = async (req, res) => {
    try{
        const recentBlogs = await Blog.find({}).sort({
            createdAt: -1
        }).limit(5);

        const blogs = await Blog.countDocuments();

        const comments = await Comment.countDocuments();
        
        const pending = await Blog.countDocuments({
            status: "pending"
        });
        
        const dashboardData = {
            blogs,
            comments,
            pending,
            recentBlogs
        };

        res.json({
            success: true,
            dashboardData
        });
    } catch(error){
        res.json({
            success: false,
            message: error.message
        });
    }
};


// =========================
// Approve Blog
// =========================
export const approveBlog = async (req, res) => {
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

    blog.status = "approved";
    blog.rejectionReason = "";

    await blog.save();

    return res.status(200).json({
      success: true,
      message: "Blog approved successfully",
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
// REJECT BLOG
// =========================
export const rejectBlog = async (req, res) => {
  try {
    const { id, reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Blog ID",
      });
    }

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required",
      });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    blog.status = "rejected";
    blog.rejectionReason = reason.trim();

    await blog.save();

    return res.status(200).json({
      success: true,
      message: "Blog rejected successfully",
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
// GET ALL COMMENTS
// =========================

export const getAllComments = async (req, res) => {
    try{
        const comments = await Comment.find({})
        .populate("blog")
        .populate("user", "name email")
        .sort({
            createdAt: -1
        })
        res.json({
            success: true,
            comments
        });
    } catch(error){
        res.json({
            success: false,
            message: error.message
        });
    }
}

// =========================
// DELETE COMMENT
// =========================

export const deleteCommentById = async (req, res) =>{
    try{
        const {id} = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.json(
                {
                success: false,
                message: "Invalid Comment ID"
                }
            );
        }

        const comment = await Comment.findById(id);

        if(!comment){
            return res.json({
                success: false,
                message: "Comment not found"
            });
        }

        await Comment.findByIdAndDelete(id);

        res.json({
            success: true,
            message: "Comment deleted successfully"
        });
    } catch(error){
        res.json({
            success: false,
            message: error.message
        });
    }
};

// =========================
// APPROVE COMMENT
// =========================

export const approveCommentById = async (req, res) =>{
    try{
        const {id} = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.json(
                {
                success: false,
                message: "Invalid Comment ID"
                }
            );
        }

        const comment = await Comment.findById(id);

        if(!comment){
            return res.json({
                success: false,
                message: "Comment not found"
            });
        }

        comment.isApproved = true;
        
        await comment.save();

        res.json({
            success: true,
            message: "Comment approved successfully"
        });
    } catch(error){
        res.json({
            success: false,
            message: error.message
        });
    }
};