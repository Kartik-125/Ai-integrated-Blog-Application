import { ApiError } from "../utils/asyncHandler.js";

// Validates req[source] (default "body") against a Zod schema. On
// failure, throws an ApiError(400, ...) with the first validation
// issue's message — plain and synchronous, so no asyncHandler needed
// here; Express has always caught synchronous throws from middleware.
//
// On success, req[source] is REPLACED with schema.parse()'s output —
// not just checked. This matters because a schema can trim strings,
// so by the time your controller runs, req.body.email is already
// trimmed, with no need to repeat that in the controller.
export const validate = (schema, source = "body") => (req, res, next) => {
  const result = schema.safeParse(req[source]);

  if (!result.success) {
    const firstIssue = result.error.issues[0];
    throw new ApiError(400, firstIssue.message);
  }

  // Express 5 made req.query a getter with no setter — assigning to it
  // directly throws a TypeError. req.body and req.params stay directly
  // writable, so only "query" needs the workaround: validated/coerced
  // query params land on req.validatedQuery instead, and the
  // controller reads from there.
  if (source === "query") {
    req.validatedQuery = result.data;
  } else {
    req[source] = result.data;
  }

  next();
};