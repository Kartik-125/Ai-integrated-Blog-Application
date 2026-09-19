import { ApiError } from "../utils/asyncHandler.js";

// Central error handler. Express recognises a middleware with FOUR
// arguments as an error handler, which is why `next` is here even
// though it looks unused — remove it and Express treats this as a
// normal middleware and never calls it.
//
// Mounted last in server.js, after all routes.
export const errorHandler = (err, req, res, next) => {
  console.error(`${req.method} ${req.originalUrl} —`, err);

  // Errors we threw on purpose, with a known status code.
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Gemini rate limits — previously repeated in every AI controller's
  // catch block, now handled in one place.
  if (err?.status === 429 || err?.error?.code === 429) {
    return res.status(429).json({
      success: false,
      message: "AI is a bit busy right now (rate limit) — try again in a minute.",
    });
  }

  // Mongoose: malformed ObjectId (e.g. /api/blog/not-a-real-id)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid id",
    });
  }

  // Mongoose: schema validation failure
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: Object.values(err.errors)[0]?.message || "Validation failed",
    });
  }

  // Multer: upload rejected — either fileFilter turned it down (that
  // path throws an ApiError directly, handled above) or a built-in
  // limit was hit, like fileSize. err.code identifies which one.
  if (err.name === "MulterError") {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "Image is too large (max 5MB)"
        : "Image upload failed";

    return res.status(400).json({
      success: false,
      message,
    });
  }

  // Anything unexpected. Don't leak internals to the client — the real
  // error is already in the server log above.
  return res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
};