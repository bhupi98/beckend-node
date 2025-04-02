import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.mjs";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const [[existingUser]] = await db.query(
    "SELECT id FROM users WHERE email = ?",
    [email]
  );
  if (existingUser)
    return res.status(400).json({ message: "User already exists" });

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert user into DB
  await db.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, hashedPassword, "user"]
  );

  res.status(201).json({ message: "User registered successfully" });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  // Fetch user from DB
  const [[user]] = await db.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  console.log("user", user);
  if (!user.email)
    return res.status(401).json({ message: "Invalid credentials" });

  // Verify password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  // Generate JWT
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });
};
