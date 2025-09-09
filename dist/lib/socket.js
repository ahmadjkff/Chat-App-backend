"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = exports.io = void 0;
exports.getReceiverSocketId = getReceiverSocketId;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
exports.app = app;
const server = http_1.default.createServer(app);
exports.server = server;
const io = new socket_io_1.Server(server, {
    cors: {
        origin: [
            "http://localhost:5173",
            "https://chat-app-frontend-qc18.onrender.com/api",
        ],
    },
});
exports.io = io;
function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}
const userSocketMap = {};
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
