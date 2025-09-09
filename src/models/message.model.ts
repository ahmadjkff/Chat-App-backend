import mongoose, { Document, ObjectId } from "mongoose";

interface IMessage extends Document {
  senderId: ObjectId | string;
  receiverId: ObjectId | string;
  text: string;
  img: string;
}

const messageSchema = new mongoose.Schema<IMessage>(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: { type: String },
    img: { type: String },
  },
  { timestamps: true }
);

const message = mongoose.model("Message", messageSchema);

export default message;
