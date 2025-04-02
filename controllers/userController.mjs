import db from "../config/db.mjs";

export const getUserProfile = async (req, res) => {
  const [[user]] = await db.query(
    "SELECT id, name, email, role FROM users WHERE id = ?",
    [req.user.id]
  );
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json(user);
};

export const updateUserProfile = async (req, res) => {
  const { name, email } = req.body;
  await db.query("UPDATE users SET name = ?, email = ? WHERE id = ?", [
    name,
    email,
    req.user.id,
  ]);

  res.json({ message: "Profile updated successfully" });
};

export const getAllUsers = async (req, res) => {
  const [users] = await db.query("SELECT id, name, email, role FROM users");
  res.json(users);
};
