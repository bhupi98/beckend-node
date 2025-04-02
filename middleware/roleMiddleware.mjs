import db from "../config/db.mjs";

export default (requiredRoles) => {
  return async (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Access Denied" });

    const userRole = req.user.role;
    const [rolePermissions] = await db.query(
      "SELECT permission FROM roles WHERE role = ?",
      [userRole]
    );
    const permissions = rolePermissions.map((r) => r.permission);

    if (!requiredRoles.some((role) => permissions.includes(role))) {
      return res.status(403).json({ message: "Access Forbidden" });
    }
    next();
  };
};
