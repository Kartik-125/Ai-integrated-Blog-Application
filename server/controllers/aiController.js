import { generateBlogContent, reviewBlogContent, embedText, answerFromContext } from "../configs/gemini.js";
import { searchChunks } from "../utils/searchChunks.js";
import { asyncHandler, ApiError } from "../utils/asyncHandler.js";
import Blog from "../models/Blog.js";

// =========================
// Generate Blog Content (AI)
// =========================
export const generateContent = asyncHandler(async (req, res) => {
  const { title, category, excerpt } = req.body;

  if (!title || !title.trim()) {
    throw new ApiError(400, "A title is required to generate content");
  }

  const content = await generateBlogContent({
    title: title.trim(),
    category,
    excerpt,
  });

  if (!content) {
    throw new ApiError(502, "AI returned an empty response, try again");
  }

  return res.status(200).json({
    success: true,
    content,
  });
});

// =========================
// AI Review Check (Admin)
// =========================
export const reviewBlog = asyncHandler(async (req, res) => {
  const { title, excerpt, content, category } = req.body;

  if (!title || !content) {
    throw new ApiError(400, "Title and content are required to run a review");
  }

  const review = await reviewBlogContent({ title, excerpt, content, category });

  return res.status(200).json({
    success: true,
    review,
  });
});

// =========================
// Ask DailyReads (RAG Chatbot)
// =========================
export const askQuestion = asyncHandler(async (req, res) => {
  const { question } = req.body;

  if (!question || !question.trim()) {
    throw new ApiError(400, "A question is required");
  }

  const trimmedQuestion = question.trim();

  // "RETRIEVAL_QUERY" here, not "RETRIEVAL_DOCUMENT" — this text is
  // being searched WITH, not stored to be searched later.
  const questionEmbedding = await embedText(trimmedQuestion, "RETRIEVAL_QUERY");

  const matches = await searchChunks(questionEmbedding, 5);

  // No indexed content at all yet — skip calling Gemini with empty context.
  if (matches.length === 0) {
    return res.status(200).json({
      success: true,
      answer:
        "I don't have any blog content to answer that yet — check back once there are more approved posts!",
      sources: [],
    });
  }

  const answer = await answerFromContext({
    question: trimmedQuestion,
    contextChunks: matches,
  });

  // Multiple retrieved chunks can come from the same blog — dedupe
  // before looking up titles for the "Sources" list.
  const blogIds = [...new Set(matches.map((match) => match.blog.toString()))];
  const blogs = await Blog.find({ _id: { $in: blogIds } }).select("title");

  return res.status(200).json({
    success: true,
    answer,
    sources: blogs.map((blog) => ({ id: blog._id, title: blog.title })),
  });
});