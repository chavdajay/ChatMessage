import { User } from ".";
import { UserModel } from "./schema";

/**
 *
 * @param email user email
 * @returns null or User class
 */
export const getUserByNumber = async (contactNo: string) => {
  const user = await UserModel.findOne({ contactNo }).sort({ createdAt: -1 });
  return user ? new User(user) : null;
};
