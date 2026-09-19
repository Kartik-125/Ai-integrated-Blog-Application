import multer from "multer";
import { ApiError } from "../utils/asyncHandler.js";

const storage = multer.diskStorage({});

// An explicit allowlist rather than a blanket "starts with image/" check
// — that would also accept things like image/svg+xml, which can embed
// scripts, or formats browsers can't actually render inline.
const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const fileFilter = (req, file, cb) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(
      new ApiError(400, "Only JPEG, PNG, WEBP, or GIF images are allowed")
    );
  }

  cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

export default upload;