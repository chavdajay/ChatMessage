import mongoose from "mongoose";

const authSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    first_name: { type: String, required: false },
    last_name: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contact_no: { type: String, required: true },
    is_superuser: { type: Boolean, default: false },
    is_staff: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true },
    is_approve: { type: Boolean, default: false },
    last_login: { type: Date },
    date_joined: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const Auth = mongoose.model("Auth", authSchema);
