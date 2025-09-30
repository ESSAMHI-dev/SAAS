import sql from "../configs/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const signUp = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const [existing] = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (existing)
      return res
        .status(400)
        .json({ success: false, message: "Email already in use" });

    const password_hash = await bcrypt.hash(password, 10);
    const [newUser] = await sql`
      INSERT INTO users (email, password_hash, first_name, last_name)
      VALUES (${email}, ${password_hash}, ${firstName}, ${lastName})
      RETURNING id, email, first_name, last_name, plan
    `;
    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({ success: true, token, user: newUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [user] = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        plan: user.plan,
      },
    });
  } catch (err) {
    console.error("SignIn error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

