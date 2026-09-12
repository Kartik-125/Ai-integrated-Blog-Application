import mongoose from "mongoose";

const chunkschema = new mongoose.Schema(
    {
        blog: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Blog",
            required: true

        },
        text: {
            type: String,
            required: true

        },
        embedding: {
            type: [Number],
        required: true

        },
        chunkIndex: {
            type: Number,
        required: true

        },
    },
    {
        timestamps: true
    }
);

chunkschema.index({createdAt: -1 });

const Chunk = mongoose.model('Chunk', chunkschema);

export default Chunk;

