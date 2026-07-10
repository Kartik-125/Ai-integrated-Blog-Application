import fs from 'fs'
import imagekit from '../configs/imageKit.js';
import Blog from '../models/Blog.js'
import Comment from '../models/Comment.js';
import mongoose from 'mongoose';


//add blogs
export const addBlog = async (req, res)=>{
    try{
        const {title, subTitle, description, category, isPublished} = 
            JSON.parse(req.body.blog);
        

        const imageFile = req.file;


        if(!title || !description || !category || !imageFile){
            return res.json({
                success: false, 
                message: "missing required fields"
            });
        }

        //Read Uploaded image
        const fileBuffer = fs.readFileSync(imageFile.path)

        // upload image to image kit
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: "/blogs"
        });

        const image = response.url;

        const imageFileId = response.fileId;

        // Delete temporary file
        fs.unlinkSync(imageFile.path);

        //Save the blog in MongoDB
        const blog = await Blog.create({
            title, 
            subTitle, 
            description, 
            category, 
            image, 
            imageFileId,
            isPublished
        });

        res.json({
            success:true, 
            message: "Blog added successfully",
            blog
        });   
    } catch(error) {
        res.json({
            success:false, 
            message: error.message
        });
    }
};

// get all published blogs
export const getAllBlogs = async(req, res) =>{
    try{
        const blogs = await Blog.find({
            isPublished: true
        }).sort({
            createdAt: -1,
        });

        res.json({
            success: true, 
            blogs
        });
    } catch(error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Get Blog By Id
export const getBlogById = async(req,res) =>{
    try{
        const { blogId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(blogId)) {
        return res.json(
            {
                success: false,
                message: "Invalid Blog ID"
            }
        );
}

        const blog = await Blog.findById(blogId)
        
        if(!blog){
            return res.json({
                success: false, 
                message: "Blog not found"
            });
        }

        res.json({
            success: true, 
            blog
        });
    } catch(error){
        res.json({
            success:false, 
            message: error.message
        });
    }
};

// Delete Blog By Id
export const deleteBlogById = async(req,res) =>{
    try{
        const {blogId} = req.body;

        if (!mongoose.Types.ObjectId.isValid(blogId)) {
            return res.json(
                {
                    success: false,
                    message: "Invalid Blog ID"
                }
            );
        }

        const blog = await Blog.findById(blogId);

        if(!blog){
            return res.json({
            success: false, 
            message: 'Blog not found'
            });
        }

        // delete image from ImageKit
        await imagekit.deleteFile(blog.imageFileId);

        // Delete blog
        await Blog.findByIdAndDelete(blogId);

        // delete all comments of this blog
        await Comment.deleteMany({
            blog: blogId
        });

        res.json({
        success: true,
        message: "Blog deleted successfully",
        });
    } catch(error){
        res.json({
            success: false, 
            message: error.message
        });
    }
};


// Publish or Unpublish Blog
export const togglePublish = async(req, res)=>{
    try{
        const { id } = req.body;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.json(
                {
                success: false,
                message: "Invalid Blog ID"
                }
            );
        }

        const blog = await Blog.findById(id);
        
        if(!blog){
            return res.json({
                success:false, 
                message: "Blog not found"
            });
        }

        blog.isPublished  = !blog.isPublished;
        
        await blog.save();
        
        res.json({
            success: true, 
            message: 'Blog status updated',
            isPublished: blog.isPublished
        });
    } catch(error){
        res.json({
            success: false, 
            message: error.message
        });
    }
};

// add comment
export const addComment = async (req, res) => {
    try{
        const {blog, name, content} = req.body;

        if(!blog || !name || !content){
            return res.json({
            success: false, 
            message: "Missing Required Fields"
            });
        }

        const blogExists = await Blog.findById(blog);

        if (!blogExists || !blogExists.isPublished) {
        return res.json({
            success: false,
            message: "Blog not found",
            });
        }

        await Comment.create({
            blog, 
            name, 
            content
        });
        
        res.json({
            success: true, 
            message: 'Comment added for review'
        });
    } catch(error){
        res.json({
            success: false, 
            message: error.message
        });
    }
};

// get approved blog comments
export const getBlogComments = async(req, res) => {
    try{
        const {blogId} = req.body;

        const comments = await Comment.find({
            blog: blogId, 
            isApproved: true
        }).sort({
            createdAt: -1
        });

        res.json({
            success: true, 
            comments
        });
    } catch(error){
        console.error()
        res.json({
            success: false, 
            message: error.message
        });
    }
};