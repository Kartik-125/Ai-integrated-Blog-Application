import jwt from 'jsonwebtoken'
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';
import mongoose from 'mongoose';


// admin login
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
            {email}, 
            process.env.JWT_SECRET,
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


// get all blogs (admin)
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

// get all comments
export const getAllComments = async (req, res) => {
    try{
        const comments = await Comment.find({}).populate("blog").sort({
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

// dashboard
export const getDashboard = async (req, res) => {
    try{
        const recentBlogs = await Blog.find({}).sort({
            createdAt: -1
        }).limit(5);

        const blogs = await Blog.countDocuments();

        const comments = await Comment.countDocuments();
        
        const drafts = await Blog.countDocuments({
            isPublished: false
        });
        
        const dashboardData = {
            blogs,
            comments,
            drafts,
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


//Delete Comment
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

// Approve Comment
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