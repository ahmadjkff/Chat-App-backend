"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const message_route_1 = __importDefault(require("./routes/message.route"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./lib/db");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const socket_1 = require("./lib/socket");
const PORT = process.env.PORT || 5001;
const allowedOrigins = [
    "http://localhost:5173",
    "https://chat-app-frontend-qc18.onrender.com",
];
dotenv_1.default.config();
socket_1.app.use(express_1.default.json({ limit: "40mb" })); // default 100kb
socket_1.app.use(express_1.default.urlencoded({ limit: "40mb", extended: true }));
socket_1.app.use((0, cookie_parser_1.default)());
socket_1.app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin))
            callback(null, true);
        else
            callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
}));
socket_1.app.use("/api/auth", auth_route_1.default);
socket_1.app.use("/api/messages", message_route_1.default);
socket_1.app.get("/", (req, res) => {
    res.send("Chat App Backend is running!");
});
socket_1.server.listen(PORT, () => {
    console.log("running on ", PORT);
    (0, db_1.connectDB)();
});
