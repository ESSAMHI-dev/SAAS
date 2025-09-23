import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";

export const getUserCreations = async (req, res) => {
  try {
    const { userId } = req.auth();
    const creations = await sql`select * from creations where user_id = ${userId} ORDER BY created_at DESC`;
    res.json({ success: true, creations });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getPublishedCreations = async (req, res) => {
  try {
    const creations = await sql`select * from creations where publish = true ORDER BY created_at DESC`;
    res.json({ success: true, creations });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const toggleLikeCreation = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;
    const [creation] = await sql`SELECT * FROM creations where id = ${id}`;

    if (!creation) {
      return res.json({ success: false, message: "Creation Not Found" });
    }

    const currentLikes = creation.likes;
    const userIdStr = userId.toString();
    let updatedLikes;
    let message;

    if (currentLikes.includes(userIdStr)) {
      updatedLikes = currentLikes.filter((user) => user !== userIdStr);
      message = "Creation unliked";
    } else {
      updatedLikes = [...currentLikes, userIdStr];
      message = "Creation Liked";
    }

    const formattedArray = `{${updatedLikes.join(",")}}`;
    await sql`UPDATE creations SET likes  = ${formattedArray} :: text[] where id = ${id}`;
    res.json({ success: true, message });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const DeleteUserCreation = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.params;
    const [request] = await sql`Select * from creations where id = ${id} and user_id = ${userId}`;

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Creation not found or you do not have permission to delete it.",
      });
    }

    await sql`Delete from creations where id=${id}`;
    return res.status(200).json({
      success: true,
      message: "Creation deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the creation.",
    });
  }
};

export const getUser = async (req, res) => {
  const { userId } = req.auth();
  try {
    const user = await clerkClient.users.getUser(userId);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to get user!" });
  }
};

export const updateUser = async (req, res) => {
  const { userId } = req.auth();
  const { firstName, lastName, username, imageUrl } = req.body;

  try {
    const updatedUser = await clerkClient.users.updateUser(userId, {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(username && { username }),
      ...(imageUrl && { imageUrl }),
    });

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Failed to update user!" });
  }
};

export const deleteUser = async (req, res) => {
  const { userId } = req.auth();

  try {
    await clerkClient.users.deleteUser(userId);
    res.status(200).json({ message: "User deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user!" });
  }
};
