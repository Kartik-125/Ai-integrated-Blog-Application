import fs from 'fs'
import imagekit from '../configs/imageKit.js';
import Blog from '../models/Blog.js'


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

        //Read Uploaded file
        const fileBuffer = fs.readFileSync(imageFile.path)

        // upload image to image kit
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: "/blogs"
        });
        const image = response.url;

        // Delete temporary file
        fs.unlinkSync(imageFile.path);

        //Save the blog in MongoDB
        await Blog.create({
            title, 
            subTitle, 
            description, 
            category, 
            image, 
            isPublished
        });

        res.json({
            success:true, 
            message: "Blog added successfully"
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
        const blogs = await Blog.find({isPublished: true}).sort({
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
        const {blogId} = req.params;

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

        const blog = await Blog.findById(blogId);

        if(!blog){
            res.json({
            success: true, 
            message: 'Blog Deleted Succesfuly'
            });
        }

        await Blog.findByIdAndDelete(blogId);

        res.json({
        success: true,
        message: "Blog deleted successfully",
        });

    } catch(error){
        res.json({
            success:false, 
            message: error.message
        });
    }
};


// Publish 
export const togglePublish = async(req, res)=>{
    try{
        const { id } = req.body;
        
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
// export const addComment = async (req, res) => {
//     try{
//         const {blog, name, content} = req.body;
//         await
//     } catch(error){
//     res.json({
//             success: false, 
//             message: error.message
//         });
//     }
// }