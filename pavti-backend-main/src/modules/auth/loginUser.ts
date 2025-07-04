import { Auth } from "./schema/auth";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginUser = async ({ email, password }: { email: string; password: string }) => {
  const user = await Auth.findOne({ email });

  if (!user) {
    throw { status: 401, message: "Invalid email or password." };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw { status: 401, message: "Invalid email or password." };
  }

  user.last_login = new Date();
  await user.save();

  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });

  return { token, email: user.email, username: user.username };
};
