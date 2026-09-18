import { rateLimit, ipKeyGenerator } from "express-rate-limit";

// Rate limits the AI routes. These matter more than ordinary routes
// because every call costs a slice of the app's shared Gemini free-tier
// quota — one user spamming requests can exhaust the daily cap for
// everyone, so the limit is per-user rather than global.
//
// Note: the default store is in-memory, so counts reset when the server
// restarts and aren't shared across multiple instances. Fine for a
// single-server setup; a Redis store would be the upgrade path if this
// ever runs on more than one node.
const buildLimiter = ({ windowMs, limit, message }) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,

    // Key on the authenticated identity so people sharing an IP — a
    // college network, an office, a phone on mobile data — don't eat
    // each other's quota. userAuth sets req.userId; authAdmin sets
    // req.admin instead, hence the second branch. Falls back to IP for
    // anything unauthenticated that slips through; ipKeyGenerator is
    // used rather than raw req.ip because it correctly handles
    // IPv4-mapped IPv6 addresses.
    keyGenerator: (req) => {
      if (req.userId) return req.userId.toString();
      if (req.admin?.id) return `admin:${req.admin.id}`;
      return ipKeyGenerator(req.ip);
    },

    handler: (req, res) =>
      res.status(429).json({
        success: false,
        message,
      }),
  });

// Drafting a blog post is a deliberate, occasional action.
export const generateLimiter = buildLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 15,
  message:
    "You've generated a lot of drafts recently — try again in a little while.",
});

// Admin pre-checks are one-per-blog-review, so this is generous.
export const reviewLimiter = buildLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 30,
  message: "Too many AI checks in a row — give it a minute and try again.",
});

// Chat is the most casually repeated action, so it gets a shorter
// window with a tighter per-window cap.
export const askLimiter = buildLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20,
  message:
    "You're asking questions faster than I can keep up — try again shortly.",
});