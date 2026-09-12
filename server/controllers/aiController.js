import { generateBlogContent, reviewBlogContent } from "../configs/gemini.js";

// =========================
// Generate Blog Content (AI)
// =========================
export const generateContent = async (req, res) => {
  try {
    const { title, category, excerpt } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "A title is required to generate content",
      });
    }

    const content = await generateBlogContent({
      title: title.trim(),
      category,
      excerpt,
    });

    if (!content) {
      return res.status(502).json({
        success: false,
        message: "AI returned an empty response, try again",
      });
    }

    return res.status(200).json({
      success: true,
      content,
    });
  } catch (error) {
    console.error("AI generateContent error:", error);

    // Gemini SDK surfaces rate-limit errors with a 429 status
    if (error?.status === 429 || error?.error?.code === 429) {
      return res.status(429).json({
        success: false,
        message: "AI is a bit busy right now (rate limit) — try again in a minute.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to generate content",
    });
  }
};

// =========================
// AI Review Check (Admin)
// =========================
export const reviewBlog = async (req, res) => {
  try {
    const { title, excerpt, content, category } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required to run a review",
      });
    }

    const review = await reviewBlogContent({ title, excerpt, content, category });

    return res.status(200).json({
      success: true,
      review,
    });
  } catch (error) {
    console.error("AI reviewBlog error:", error);

    if (error?.status === 429 || error?.error?.code === 429) {
      return res.status(429).json({
        success: false,
        message: "AI is a bit busy right now (rate limit) — try again in a minute.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to run AI review",
    });
  }
};