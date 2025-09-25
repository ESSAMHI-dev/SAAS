import express from "express";
import { auth } from "../middlewares/auth.js";
import {
  deleteUserCreation,
  getPublishedCreations,
  getUserCreations,
  toggleLikeCreation,
  getUser,
  updateUser,
  deleteUser,
  uploadUserImage,
} from "../controllers/userController.js";
import { upload } from "../configs/multer.js";

const userRouter = express.Router();

userRouter.get("/get-user-creations", auth, getUserCreations);
userRouter.get("/get-published-creations", auth, getPublishedCreations);
userRouter.post("/toggle-like-creation", auth, toggleLikeCreation);
userRouter.delete("/creations/:id", auth, deleteUserCreation);
userRouter.get("/profile", auth, getUser);
userRouter.put("/profile", auth, updateUser);
userRouter.delete("/profile", auth, deleteUser);
userRouter.post("/upload-image", auth, upload.single("image"), uploadUserImage);

export default userRouter;
