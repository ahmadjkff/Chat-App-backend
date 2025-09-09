"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in environment variables");
        }
        const conn = await mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log(`mongodb  connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.log(`mongodb connection error: ${error}`);
    }
};
exports.connectDB = connectDB;
