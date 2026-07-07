import fs from 'fs'
import imagekit from '../configs/imageKit.js';
import Blog from '../models/Blog.js'

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