"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectRoute = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            res.status(400).json({ message: "Unauthorized - no token provided" });
            return;
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            res.status(500).json({ message: "JWT secret not configured" });
            return;
        }
        const decode = jsonwebtoken_1.default.verify(token, jwtSecret);
        if (!decode) {
            res.status(400).json({ message: "Unauthorized - invalid token" });
            return;
        }
        const user = await user_model_1.default.findById(decode.userId).select("-password");
        if (!user) {
            res.status(404).json({ message: "User Not Found" });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.log("error in protectRoute middleware", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.protectRoute = protectRoute;
