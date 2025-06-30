import { Schema, model } from "mongoose";
import { IUser } from "../types";

const user = new Schema<IUser>(
  {
    fullName: {
      type: String,
      maxlength: 80,
    },
    email: {
      type: String,
      sparse: true,
    },
    contactNo: {
      type: String,
      maxlength: 20,
    },
    isApprove: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isTempName: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const UserModel = model<IUser>("user", user);
