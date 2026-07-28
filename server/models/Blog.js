import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String, 
            required: true,
            trim: true
        },
        excerpt: {
            type: String,
            required: true,
            trim: true,
            maxlength: 250
        },
        content: {
            type: String, 
            required: true
        },
        category: {
            type: String, 
            required: true,
            trim: true
        },


        image: {
            type: String,
            required: true
        },
        imageFileId: {
            type: String,
            required: true
        },


        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },


        slug: {
            type: String,
            unique: true,
            lowercase: true,
            required: true,
            trim: true,
        },
        views: {
            type: Number,
            default: 0,
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            }
        ],
        bookmarks: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            }
        ],
        isPublished: {
            type: Boolean,
            default: false
        }
    }, 
    {
        timestamps: true
    }
);

blogSchema.index({ createdAt: -1});
blogSchema.index({ author: 1 });
blogSchema.index({ category: 1 });


const Blog = mongoose.model('Blog',  blogSchema);

export default Blog; 