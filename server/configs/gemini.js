import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Gemini 2.5 models are being retired (fully shut down October 2026), so
// this uses the current 3.x generation. gemini-3.5-flash-lite is the
// low-latency, high-volume option — a good fit for "click it a lot while
// drafting" — with a free-tier daily quota similar to what 2.5-flash-lite
// used to offer. Swap to "gemini-3.6-flash" or "gemini-3.7-flash" if you
// want noticeably better writing quality and can live with a lower
// daily cap on the free tier.
const MODEL = "gemini-3.5-flash-lite";

export const generateBlogContent = async ({ title, category, excerpt }) => {
  const prompt = `You are a blog writing assistant for a blogging platform called DailyReads.

Write a complete, engaging blog post draft as clean HTML for the following:

Title: ${title}
${category ? `Category: ${category}` : ""}
${excerpt ? `Angle/excerpt to build around: ${excerpt}` : ""}

Rules:
- Output ONLY the body HTML — no <html>, <head>, <body>, <script>, <style>, or markdown code fences.
- Use only these tags: <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>, <blockquote>.
- Do not repeat the title as a heading — start straight into the content.
- Aim for 500-800 words, broken into a few clear sections with <h2> subheadings.
- Write in a natural, engaging blog voice appropriate to the category (not a generic listicle unless the topic calls for it).`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
  });

  let text = (response.text || "").trim();

  // Belt-and-braces: strip stray markdown code fences if the model adds
  // them anyway despite the instruction not to.
  text = text
    .replace(/^```(?:html)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  return text;
};

export const reviewBlogContent = async ({ title, excerpt, content, category }) => {
  const prompt = `You are a content-moderation assistant helping a human admin decide whether a submitted blog post is fit to publish on a blogging platform called DailyReads. You do not make the final decision — the admin does, using your notes as a head start.

Title: ${title}
${category ? `Category: ${category}` : ""}
${excerpt ? `Excerpt: ${excerpt}` : ""}
Content (HTML):
${content}

Check specifically for:
- Spam, scams, or promotional/affiliate link stuffing
- Hate speech, harassment, or other clearly inappropriate content
- Content that is empty, placeholder/lorem-ipsum text, or unrelated to the stated title/category
- Plagiarism-style generic filler with no real substance
- A broken/unreadable state (leftover HTML artifacts, garbled or repeated text)

Do NOT flag a post merely for a casual tone, minor typos, an opinion you personally disagree with, or being short but coherent. Most genuine posts should come back "ok" — only use "flag" for a real, specific, actionable issue.`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          verdict: { type: Type.STRING, enum: ["ok", "flag"] },
          issues: { type: Type.ARRAY, items: { type: Type.STRING } },
          reasoning: { type: Type.STRING },
        },
        required: ["verdict", "issues", "reasoning"],
      },
    },
  });

  const raw = (response.text || "").trim();

  try {
    return JSON.parse(raw);
  } catch (err) {
    // Belt-and-braces: in case the model wraps in fences despite JSON mode
    const cleaned = raw
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    return JSON.parse(cleaned);
  }
};

export default ai;