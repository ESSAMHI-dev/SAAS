import sql from "../configs/db.js";
import { cloudinary } from "../configs/cloudinary.js";
import fs from "fs";

export const getUserCreations = async (req, res) => {
  try {
    const userId = req.user.id;
    const creations = await sql`
      SELECT * FROM creations 
      WHERE user_id = ${userId} 
      ORDER BY created_at DESC
    `;
    res.json({ success: true, creations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPublishedCreations = async (req, res) => {
  try {
    const creations = await sql`
      SELECT * FROM creations 
      WHERE publish = true 
      ORDER BY created_at DESC
    `;
    res.json({ success: true, creations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleLikeCreation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.body;
    const [creation] = await sql`SELECT * FROM creations WHERE id = ${id}`;
    if (!creation)
      return res.status(404).json({ success: false, message: "Creation not found" });

    const currentLikes = creation.likes || [];
    const userIdStr = userId.toString();
    const updatedLikes = currentLikes.includes(userIdStr)
      ? currentLikes.filter((user) => user !== userIdStr)
      : [...currentLikes, userIdStr];

    const message = currentLikes.includes(userIdStr) ? "Creation unliked" : "Creation liked";
    const formattedArray = `{${updatedLikes.join(",")}}`;

    await sql`UPDATE creations SET likes = ${formattedArray}::text[] WHERE id = ${id}`;
    res.json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUserCreation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const [creation] = await sql`
      SELECT * FROM creations WHERE id = ${id} AND user_id = ${userId}
    `;
    if (!creation)
      return res.status(404).json({
        success: false,
        message: "Creation not found or you do not have permission to delete it.",
      });

    await sql`DELETE FROM creations WHERE id = ${id}`;
    res.json({ success: true, message: "Creation deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const [user] = await sql`
      SELECT id, email, first_name, last_name, username, image_url, plan 
      FROM users 
      WHERE id = ${userId}
    `;
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.username,
        imageUrl: user.image_url,
        plan: user.plan,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, username, imageUrl } = req.body;

    await sql`
      UPDATE users
      SET first_name = ${firstName}, last_name = ${lastName}, username = ${username}, image_url = ${imageUrl}, updated_at = NOW()
      WHERE id = ${userId}
    `;

    res.json({ success: true, message: "Profile updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.user.id;
    await sql`DELETE FROM users WHERE id = ${userId}`;
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const uploadUserImage = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, message: "No file uploaded" });

    const userId = req.user.id;

    // Upload the local file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "profile_images",
    });

    // Cloudinary URL
    const imageUrl = result.secure_url;

    // Update user in DB
    const [updatedUser] = await sql`
      UPDATE users
      SET image_url = ${imageUrl}, updated_at = NOW()
      WHERE id = ${userId}
      RETURNING id, first_name, last_name, username, image_url, plan
    `;

    // Optionally delete the temp local file
    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Failed to delete temp file:", err);
    });

    res.json({ success: true, imageUrl, user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to upload image" });
  }
};
