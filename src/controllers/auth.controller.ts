import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils";
import cloudinary from "../lib/cloudinary";

export const signup = async (req: Request, res: Response) => {
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

    const user = await User.findOne({ email });

    if (user) {
      res.status(400).json({ message: "User already exist" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("error in signup controller", (error as Error).message);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).send({ message: "Invalid credentials" });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      res.status(400).json({ message: "Incorrect credentials" });
      return;
    }

    generateToken(user._id, res);
    res.status(200).send({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", (error as Error).message);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const logout = async (req: Request, res: Response) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", (error as Error).message);
    res.status(500).json({ message: "INternal server error" });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { profilePic } = req.body;

    if (!profilePic) {
      res.status(400).json({ message: "Profile Pic is required" });
      return;
    }

    const userId = req.user._id;

    const updateResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: updateResponse.secure_url,
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in updateProfile controller:", (error as Error).message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req: Request, res: Response) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("error in checkAuth controller", (error as Error).message);
    res.status(500).json({ message: "Internal server error" });
  }
};
