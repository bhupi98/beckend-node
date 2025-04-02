import jwt from "jsonwebtoken";
import db from "../config/db.mjs";

export default async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    const [[user]] = await db.query("SELECT role FROM users WHERE id = ?", [
      decoded.id,
    ]);
    if (!user) return res.status(403).json({ message: "Unauthorized" });

    req.user = { ...decoded, role: user.role };
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};
