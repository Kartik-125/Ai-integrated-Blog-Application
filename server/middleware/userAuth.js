import jwt from "jsonwebtoken";
import User from "../models/User.js";

const userAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.USER_JWT_SECRET
    );

    if (decoded.type !== "user") {
      return res.status(403).json({
        success: false,
        message: "User access required",
      });
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("User Auth Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired Token",
    });
  }
};

export default userAuth;