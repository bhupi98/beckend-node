import jwt from "jsonwebtoken";
const { sign, verify } = jwt;
const SECRET = process.env.JWT_SECRET || "jwt";
export const generateToken = (paylaod) => {
  return sign(paylaod, SECRET, { expiresIn: "1m", algorithm: "HS256" });
};
export const verifyToken = (token) => {
  return verify(token, SECRET);
};
