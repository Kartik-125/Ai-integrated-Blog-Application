import { z } from "zod";

// Note on Zod v4: string-format checks like .email() are still
// supported chained off z.string() (used here so .trim() composes
// cleanly beforehand) even though the newer top-level z.email() form
// is now preferred for new, non-chained schemas.

// =========================
// User auth
// =========================
export const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().min(1, "Email is required").email("A valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("A valid email is required"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("A valid email is required"),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// =========================
// Admin
// =========================
export const adminLoginSchema = z.object({
  email: z.string().trim().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

export const rejectBlogSchema = z.object({
  id: z.string().min(1, "Blog id is required"),
  reason: z.string().trim().min(1, "Rejection reason is required"),
});

// =========================
// Blog: public listing (pagination + search)
// =========================
// Query params always arrive as strings, hence z.coerce.number() —
// this converts "2" -> 2 before the min/positive checks run.
export const getAllBlogsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(50).optional().default(12),
  category: z.string().trim().optional(),
  search: z.string().trim().optional(),
});

// =========================
// Blog: comments and bookmarks
// (createBlog/updateBlog are NOT validated here — their fields arrive
// as a JSON string inside a multipart form field (req.body.blog), so
// this body-shaped validator can't reach them directly. They still
// use the manual checks already in blogController.)
// =========================
export const commentSchema = z.object({
  blog: z.string().min(1, "Blog id is required"),
  content: z.string().trim().min(1, "Comment content is required"),
});

// =========================
// AI routes
// =========================
export const generateContentSchema = z.object({
  title: z.string().trim().min(1, "A title is required to generate content"),
  category: z.string().trim().optional(),
  excerpt: z.string().trim().optional(),
});

export const reviewBlogSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  excerpt: z.string().trim().optional(),
  content: z.string().trim().min(1, "Content is required"),
  category: z.string().trim().optional(),
});

export const askQuestionSchema = z.object({
  question: z.string().trim().min(1, "A question is required"),
});