import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        blog: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Blog',
            required: true
        },
         user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: {
            type: String,
            required: true,
            trim: true
        },
        isApproved:{
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

commentSchema.index({ blog: 1 });
commentSchema.index({ user: 1 });
const Comment = mongoose.model('Comment', commentSchema);

export default Comment; 