// Wraps an async route handler so you never have to write try/catch in
// a controller again. If the wrapped function rejects, the error is
// passed to next(), which hands it to the central error handler.
//
// Without this, an un-caught async rejection in Express just hangs the
// request — the client waits forever instead of getting a 500.
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// A small error class for "expected" failures — cases where you know
// the right status code and message to send back (bad input, not found,
// not allowed). Throw one of these from a controller and the error
// handler will use its statusCode; anything else becomes a generic 500.
export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}