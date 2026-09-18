import Chunk from "../models/Chunk.js";

// Runs Atlas Vector Search: given a question's embedding, finds the
// chunks whose embeddings are numerically closest to it.
export const searchChunks = async (queryEmbedding, limit = 5) => {
  const results = await Chunk.aggregate([
    {
      $vectorSearch: {
        index: "vector_index", // must match the Atlas index name from Step 5
        path: "embedding", // which field on Chunk holds the vectors
        queryVector: queryEmbedding, // the question's embedding
        numCandidates: 100, // how many candidates Atlas scans before narrowing down (Atlas recommends well above `limit` for good results)
        limit, // how many chunks we actually want back
      },
    },
    {
      $project: {
        text: 1,
        blog: 1,
        // vectorSearchScore is metadata Atlas attaches per result — a
        // rough 0-1 closeness score, handy for debugging/logging.
        score: { $meta: "vectorSearchScore" },
      },
    },
  ]);

  return results;
};