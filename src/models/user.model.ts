import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  _id: string;
  email: string;
  fullName: string;
  password: string;
  profilePic: string;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
    profilePic: { type: String, default: "" },
  },
  { timestamps: true }
);

const user = mongoose.model<IUser>("User", userSchema);

export default user;
