import exp from "constants";
import mongoose, { Schema, Document } from "mongoose";

// INTERFACE FOR TYPE SAFETY FOR SCHEMAS
export interface Message extends Document {
  content: string;
  createdAt: Date;
}

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isAcceptingMessage: boolean;
  isVerified: boolean;
  messages: Message[];
}

// MESSAGE SCHEMA
const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

//USER SCHEMA
const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "USERNAME IS REQUIRED"],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please use a valid email address",
    ],
  },
  password: {
    type: String,
    required: [true, "password IS REQUIRED"],
    trim: true,
  },
  verifyCode: {
    type: String,
    required: [true, "verifycode  IS REQUIRED"],
    trim: true,
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Code expiry req"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: false,
  },
  messages: [MessageSchema],
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

  export default UserModel
