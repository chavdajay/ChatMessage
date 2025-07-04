import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Auth } from "../../modules/auth/schema/auth";

const router = express.Router();

// 🔐 Register (Sign Up)
router.post("/register", async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      contact_no,
      first_name,
      last_name,
    } = req.body;

    if (!email || !password || !username || !contact_no) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const existingUser = await Auth.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Auth({
      username,
      email,
      password: hashedPassword,
      contact_no,
      first_name,
      last_name,
      is_superuser: false,
      is_staff: false,
      is_active: true,
      is_approve: false,
      date_joined: new Date(),
    });

    await newUser.save();

    return res.status(201).json({
      message: "User registered successfully",
      userId: newUser._id,
      email: newUser.email,
      username: newUser.username,
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// 🔐 Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and Password are required." });
    }

    const user = await Auth.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      email: user.email,
      username: user.username,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
