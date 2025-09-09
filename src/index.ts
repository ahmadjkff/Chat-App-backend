import express from "express";
import authRoutes from "./routes/auth.route";
import messageRoutes from "./routes/message.route";
import dotenv from "dotenv";
import { connectDB } from "./lib/db";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket";

const PORT = process.env.PORT || 5001;
const allowedOrigins = [
  "http://localhost:5173",
  "https://chat-app-frontend-qc18.onrender.com",
];

dotenv.config();

app.use(express.json({ limit: "40mb" })); // default 100kb
app.use(express.urlencoded({ limit: "40mb", extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.send("Chat App Backend is running!");
});

server.listen(PORT, () => {
  console.log("running on ", PORT);
  connectDB();
});
