import fs from 'fs'
import imagekit from '../configs/imageKit.js';
import Blog from '../models/Blog.js'

export const addBlog = async (req, res)=>{
    try{
        const {title, subTitle, description, category, isPublished} = JSON.parse(req.body.blog);
        const imageFile = req.file;

        if(!title || !description || !category || !imageFile){
            return res.json({success: false, message: "missing required fields"})
        }

        const fileBuffer = fs.readFileSync(imageFile.path)

        // upload image ot image kit
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: "/blogs"
        })

        // optimize the image
        const optimizeImageUrl = imagekit.url({
            path: response.filePath,
            transformation: [
                {quality: 'auto'}, //auto compression
                {format: 'webp'}, // convert to modern format
                {width: '1280'}  // width resizing
            ]
        }) ;

        const image =  optimizeImageUrl;

        await Blog.create({title, subTitle, description, category, image, isPublished})

        res.json({success:true, message: "Blog added successfully"})
        
    } catch(error) {
        res.json({success:false, message: error.message})

    }
}