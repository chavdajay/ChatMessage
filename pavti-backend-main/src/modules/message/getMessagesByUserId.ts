import { MessageModel } from "./schema/message";

export const getMessagesByUserId = async (
  userId: string,
  page = 1,
  limit = 10
) => {
  const skip = (page - 1) * limit;
  const messages = await MessageModel.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  const total = await MessageModel.countDocuments({ userId });
  return {
    messages,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};
