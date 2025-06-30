import { Message } from "./types";
import { MessageModel } from "./schema";

/**
 * Updates a message in the database
 * @param message Message class instance
 * @returns updated message
 */
export const updateMessage = async (message: Message) => {
  await MessageModel.findOneAndUpdate(
    { messageId: message.messageId },
    message.toJSON()
  );
  return message;
};
