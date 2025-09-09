import { Request, Response } from "express";
import user from "../models/user.model";
import message from "../models/message.model";
import cloudinary from "../lib/cloudinary";
import { getReceiverSocketId, io } from "../lib/socket";

export const getUsersForSidebar = async (req: Request, res: Response) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await user
      .find({ _id: { $ne: loggedInUserId } }) //find all users except loggedIn user
      .select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in  getUsersForSidebar: ", (error as Error).message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await message.find({
      $or: [
        { senderId: userToChatId, receiverId: myId },
        { senderId: myId, receiverId: userToChatId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages: ", (error as Error).message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imgUrl;
    if (image) {
      // upload base64 image to cloundinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imgUrl = uploadResponse.secure_url;
    }

    const newMessage = new message({
      senderId,
      receiverId,
      text,
      img: imgUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) io.to(receiverId).emit("newMessage", newMessage);

    res.status(201).send(newMessage);
  } catch (error) {
    console.log("Error in sendMessage: ", (error as Error).message);
    res.status(500).json({ error: "Internal server error" });
  }
};
