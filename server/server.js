import express from "express";
import cors from "cors";
import "dotenv/config";
import aiRouter from "./routes/aiRoutes.js";
import userRouter from "./routes/userRoutes.js";
import authRouter from "./routes/authRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import { auth } from "./middlewares/auth.js";



const app = express();

// Connect Cloudinary
await connectCloudinary();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Public route
app.get("/", (req, res) => res.send("Server is running"));

// Protected routes
app.use("/api/auth", authRouter);
app.use("/api/ai", auth, aiRouter);      
app.use("/api/user", auth, userRouter);  


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});

