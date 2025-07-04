import { Auth } from "./schema/auth";
import bcrypt from "bcrypt";
import { UserData } from "./types/auth";

export const registerUser = async (data: UserData) => {
  const { email, password, username, contact_no } = data;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !password || !username || !contact_no) {
    throw { status: 400, message: "Required fields are missing." };
  }

  if (!emailRegex.test(email)) {
    throw { status: 400, message: "Invalid email format." };
  }

  const existing = await Auth.findOne({ email });
  if (existing) {
    throw { status: 409, message: "User already exists." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new Auth({
    ...data,
    password: hashedPassword,
    date_joined: new Date(),
  });

  await newUser.save();
  return newUser;
};
