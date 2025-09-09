import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    const decode = jwt.verify(token, jwtSecret);

    if (!decode) {
      res.status(400).json({ message: "Unauthorized - invalid token" });
      return;
    }

    const user = await User.findById(
      (decode as { userId: string }).userId
    ).select("-password");
    if (!user) {
      res.status(404).json({ message: "User Not Found" });
      return;
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("error in protectRoute middleware", (error as Error).message);
    res.status(500).json({ message: "Internal server error" });
  }
};
