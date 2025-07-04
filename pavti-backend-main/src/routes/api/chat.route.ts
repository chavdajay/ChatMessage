import { Router } from "express"
import { getUsers, getUserByNumber } from "../../modules/user"
import { MessageModel } from "../../modules/message"

const router = Router()

router.get("/chat-list", async (req, res) => {
  try {
    const users = await getUsers()

    const chatListWithLatest = await Promise.all(
      users.map(async (user) => {
        const latestMessage = await MessageModel.findOne({
          mobileNumber: user.contactNo,
        })
          .sort({ createdAt: -1 }) // newest message
          .lean()

        const unseenCount = await MessageModel.countDocuments({
          mobileNumber: user.contactNo,
          isSeen: false,
        })

        return {
          _id: user._id,
          contactNo: user.contactNo,
          fullName: user.fullName,
          latest_message: latestMessage || null,
          unseen_message_count: unseenCount,
        }
      })
    )

    res.status(200).json(chatListWithLatest)
  } catch (error) {
    console.error("Get chat list error:", error)
    res.status(500).json({ error: "Failed to get chat list" })
  }
})

export default router
