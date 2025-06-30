// import { User } from ".";
// import { UserModel } from "./schema";

// /**
//  *
//  * @param user user class
//  * @returns created user
//  */
// export const saveUser = async (user: User) => {
//   const createdUser = await new UserModel(user.toJSON()).save();
//   return new User(createdUser);
// };


// Updated New Code ///

import { UserModel } from "./schema";

/**
 * Save user directly from plain object (no User class).
 * @param userData plain user data (from req.body)
 * @returns created user document
 */
export const saveUser = async (userData: any) => {
  const user = new UserModel(userData);
  return await user.save();
};
