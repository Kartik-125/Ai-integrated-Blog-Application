import jwt from "jsonwebtoken";

const authAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success:false,
            message:"Invalid authorization format"
        });
    }
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.ADMIN_JWT_SECRET
    );

    if (decoded.type !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    req.admin = decoded;

    next();

  } catch (error) {
    console.error("Admin Auth Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired Token",
    });
  }
};

export default authAdmin;