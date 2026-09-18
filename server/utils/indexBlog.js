import { chunkText } from "./chunkText.js";
import { embedText } from "../configs/gemini.js";
import Chunk from "../models/Chunk.js";

export const indexBlog = async (blog) => {
  // Delete any chunks of the blog identify via blog id so that
  // no other we never ending up overlapping copies of same notes
  await Chunk.deleteMany({ blog: blog._id });

  // splits the whole paragraph into small chunks
  const chunks = chunkText({ text: blog.content });

  // for every chunk text we ask gemini what is it about, in number this is called embedding
  const chunkDocs = await Promise.all(
    chunks.map(async (text, index) => {
      
      const embedding = await embedText(text, "RETRIEVAL_DOCUMENT");

      return {
        blog: blog._id,
        text,
        embedding,
        chunkIndex: index,
      };
    })
  );

  // One bulk insert instead of saving each chunk in a loop.
  await Chunk.insertMany(chunkDocs);
};