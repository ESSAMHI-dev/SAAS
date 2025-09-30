import jwt from "jsonwebtoken";
import sql from "../configs/db.js";

export const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user from the database
    const [user] = await sql`
  SELECT id, email, first_name, last_name, username, image_url
  FROM users
  WHERE id::text = ${decoded.userId}
`;

    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "User not found" });

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      username: user.username,
      imageUrl: user.image_url,
      plan: user.plan,
    };

    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};
