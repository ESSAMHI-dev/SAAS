import express from "express";
import { auth } from "../middlewares/auth.js";
import {
  DeleteUserCreation,
  getPublishedCreations,
  getUserCreations,
  toggleLikeCreation,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/get-user-creations", auth, getUserCreations);
userRouter.get("/get-published-creations", auth, getPublishedCreations);
userRouter.post("/toggle-like-creation", auth, toggleLikeCreation);
userRouter.delete("/creations/:id", auth, DeleteUserCreation);
userRouter.get("/profile", auth, getUser);
userRouter.put("/profile", auth, updateUser);
userRouter.delete("/profile", auth, deleteUser);

export default userRouter;
