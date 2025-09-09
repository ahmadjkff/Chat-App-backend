"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = exports.updateProfile = exports.logout = exports.login = exports.signup = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const utils_1 = require("../lib/utils");
const cloudinary_1 = __importDefault(require("../lib/cloudinary"));
const signup = async (req, res) => {
    const { email, fullName, password } = req.body;
    try {
        if (!email || !fullName || !password) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }
        if (password.length < 6) {
            res
                .status(400)
                .json({ message: "Password must be at least 6 characters" });
            return;
        }
        const user = await user_model_1.default.findOne({ email });
        if (user) {
            res.status(400).json({ message: "User already exist" });
            return;
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const newUser = new user_model_1.default({
            fullName,
            email,
            password: hashedPassword,
        });
        if (newUser) {
            (0, utils_1.generateToken)(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        }
        else {
            res.status(400).json({ message: "Invalid user data" });
        }
    }
    catch (error) {
        console.log("error in signup controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await user_model_1.default.findOne({ email });
        if (!user) {
            res.status(400).send({ message: "Invalid credentials" });
            return;
        }
        const isPasswordCorrect = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordCorrect) {
            res.status(400).json({ message: "Incorrect credentials" });
            return;
        }
        (0, utils_1.generateToken)(user._id, res);
        res.status(200).send({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });
    }
    catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.login = login;
const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "INternal server error" });
    }
};
exports.logout = logout;
const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        if (!profilePic) {
            res.status(400).json({ message: "Profile Pic is required" });
            return;
        }
        const userId = req.user._id;
        const updateResponse = await cloudinary_1.default.uploader.upload(profilePic);
        const updatedUser = await user_model_1.default.findByIdAndUpdate(userId, {
            profilePic: updateResponse.secure_url,
        }, { new: true });
        res.status(200).json(updatedUser);
    }
    catch (error) {
        console.log("Error in updateProfile controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.updateProfile = updateProfile;
const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    }
    catch (error) {
        console.log("error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.checkAuth = checkAuth;
