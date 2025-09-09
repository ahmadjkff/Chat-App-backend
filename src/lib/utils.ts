import { Response } from "express";
import jwt from "jsonwebtoken";

export const generateToken = (userId: string, res: Response) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    httpOnly: true, // prevents XSS attacks
    sameSite: "none", //CSRF attacks cross—site request forgery attacks
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};
