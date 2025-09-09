import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export function getReceiverSocketId(userId: any) {
  return userSocketMap[userId];
}

const userSocketMap: Record<any, any> = {};

io.on("connection", (socket) => {
  console.log("A user Connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId && typeof userId === "string") {
    userSocketMap[userId] = socket.id;
    // Join user to their own room for targeted messages
    socket.join(userId);
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user Disconnected", socket.id);
    if (userId && typeof userId === "string") {
      delete userSocketMap[userId];
      socket.leave(userId);
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
