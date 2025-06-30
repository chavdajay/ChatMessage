import { User } from ".";
import { UserModel } from "./schema";

/**
 *
 * @param email user email
 * @returns null or User class
 */
export const getUserByNumber = async (contactNo: string) => {
  const user = await UserModel.findOne({ contactNo });
  return user ? new User(user) : null;
};
