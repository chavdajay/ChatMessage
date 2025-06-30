import { Message } from "./types";
import { MessageModel } from "./schema";

/**
 * Saves a message to the database
 * @param message Message class instance
 * @returns saved message
 */
export const saveMessage = async (message: Message) => {
  await new MessageModel(message.toJSON()).save();
  return message;
};
