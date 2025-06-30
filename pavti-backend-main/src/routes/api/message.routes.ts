import { Router } from "express";
import { WhatsAppService } from "../../services/whatsapp.service";
import { msgData } from "../../data/msgData";
import {
  getUserByNumber,
  saveUser,
  User,
  getUserById,
} from "../../modules/user";
import { getMessagesByUserId } from "../../modules/message";
import { MessageModel } from "../../modules/message";
import { getSocketIO } from "../../socketHandler";
import { log } from "console";

const router = Router();
const whatsappService = WhatsAppService.getInstance();

/**
 * @swagger
 * tags:
 *   - name: Messages
 *     description: Message management
 */

/**
 * @swagger
 * /api/msg:
 *   get:
 *     summary: Send bulk messages
 *     description: Sends messages to multiple contacts from a predefined data source.
 *     tags: [Messages]
 *     responses:
 *       200:
 *         description: Messages sent successfully
 *       400:
 *         description: Invalid message data
 *       500:
 *         description: Failed to send messages
 */
router.get("/msg", async (req, res) => {
  try {
    const messages = msgData["DATA"]?.["MSGRPT"];
    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid message data" });
    }

    for (const contact of messages) {
      const contactNo = contact["ISD"].split("+")[1] + contact["Mobile No"];
      const chatId = `${contactNo}@c.us`;

      let user = await getUserByNumber(contactNo);
      if (!user) {
        user = await saveUser(
          new User({
            fullName: contact.Name,
            email: "",
            contactNo,
            isApprove: "approved",
            isActive: true,
            isTempName: false,
          })
        );
      }

      await whatsappService.sendMessage(chatId, contact["Message"]);
    }

    res.status(200).json({ message: "Messages sent successfully" });
  } catch (error) {
    console.error("Message sending error:", error);
    res.status(500).json({ error: "Failed to send messages" });
  }
});

/**
 * @swagger
 * /api/messages/{userId}:
 *   get:
 *     summary: Get paginated messages for a user
 *     description: Get paginated messages for a specific user, ordered by creation date.
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to retrieve messages for.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of messages per page.
 *     responses:
 *       200:
 *         description: A paginated list of messages.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messages:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Message'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *       500:
 *         description: Failed to get messages.
 */
router.get("/messages/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const data = await getMessagesByUserId(userId, page, limit);
    return res.status(200).json(data);
  } catch (error) {
    console.error("Get messages error:", error);
    return res.status(500).json({ error: "Failed to get messages" });
  }
});

/**
 * @swagger
 * /api/messages/send/user/{userId}:
 *   post:
 *     summary: Send a message to a user by ID
 *     description: Sends a text message to a user's WhatsApp number using their user ID.
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to send the message to.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Hello, this is a test message from the API."
 *             required:
 *               - message
 *     responses:
 *       200:
 *         description: Message sent successfully.
 *       400:
 *         description: Message content cannot be empty.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Failed to send message.
 */
// router.post("/messages/send/user/:userId", async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { message } = req.body;

//     if (!message) {
//       return res.status(400).json({ message: "Message cannot be empty" });
//     }

//     const user = await getUserById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const chatId = `${user.contactNo}@c.us`;
//     await whatsappService.sendMessage(chatId, message);

//     return res.status(200).json({ message: "Message sent successfully" });
//   } catch (error) {
//     console.error("Send message error:", error);
//     return res.status(500).json({ error: "Failed to send message" });
//   }
// });

//**** new updated code *** */

router.post("/messages/send/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const chatId = `${user.contactNo}@c.us`;
    await whatsappService.sendMessage(chatId, message);

    // ✅ Save the message to MongoDB
    await MessageModel.create({
      userId: user._id,
      user: Number(user.contactNo?.slice(-4)), // optional logic
      messageId: `msg-${Date.now()}`,
      message: message,
      isSend: true,
      sendedAt: new Date(),
      senderName: user.fullName || "System",
      mobileNumber: Number(user.contactNo),
    });

    return res.status(200).json({ message: "Message sent and saved" });
  } catch (error) {
    console.error("Send message error:", error);
    return res.status(500).json({ error: "Failed to send message" });
  }
});

/**
 * @swagger
 * tags:
 *   - name: Message
 *     description: Message management
 */

/**
 * @swagger
 * /api/messages/send/number:
 *   post:
 *     summary: Send a message via phone number
 *     description: Sends a text message to a WhatsApp number. If the user doesn't exist, a temporary one is created.
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contactNo:
 *                 type: string
 *                 example: "911234567890"
 *               message:
 *                 type: string
 *                 example: "Hello, this is a test message from the API."
 *             required:
 *               - contactNo
 *               - message
 *     responses:
 *       200:
 *         description: Message sent successfully.
 *       400:
 *         description: Contact number and message are required.
 *       500:
 *         description: Failed to send message.
 */
// router.post("/messages/send/number", async (req, res) => {
//   try {
//     const { contactNo, message } = req.body;

//     if (!contactNo || !message) {
//       return res
//         .status(400)
//         .json({ message: "Contact number and message are required" });
//     }

//     const chatId = `${contactNo}@c.us`;
//     let user = await getUserByNumber(contactNo);

//     if (!user) {
//       user = await saveUser(
//         new User({
//           fullName: "Unknown",
//           email: "",
//           contactNo,
//           isApprove: "approved",
//           isActive: true,
//           isTempName: true,
//         })
//       );
//     }

//     await whatsappService.sendMessage(chatId, message);
//     return res.status(200).json({ message: "Message sent successfully" });
//   } catch (error) {
//     console.error("Send message error:", error);
//     return res.status(500).json({ error: "Failed to send message" });
//   }
// });

//**** New Updated Code **** */

router.post("/messages/send/number", async (req, res) => {
  try {
    console.log("/messages/send/number", req.body);

    const { contactNo, message } = req.body;

    if (!contactNo || !message) {
      return res
        .status(400)
        .json({ message: "Contact number and message are required" });
    }

    const chatId = `${contactNo}@c.us`;
    let user = await getUserByNumber(contactNo);

    if (!user) {
      user = await saveUser(
        new User({
          fullName: "Unknown",
          email: "",
          contactNo,
          isApprove: "approved",
          isActive: true,
          isTempName: true,
        })
      );
    }
    console.log("okokokokokokoko");

    // Send message to WhatsApp
    await whatsappService.sendMessage(chatId, message);

    const io = getSocketIO();
    const systemId = "system"; // Static ID for system/sender
    const recipientId = String(user.contactNo);
    const messageId = `msg-${Date.now()}`;
    console.log("senderMessage");

    // Sender's message
    const senderMessage = await MessageModel.create({
      userId: user._id,
      user: Number(user.contactNo?.slice(-4)),
      messageId,
      message,
      isSend: true,
      sendedAt: new Date(),
      from_user: systemId,
      to_user: recipientId,
      senderName: "System",
      mobileNumber: recipientId,
    });

    console.log("reciever");

    // Receiver's copy
    await MessageModel.create({
      userId: user._id,
      user: Number(user.contactNo?.slice(-4)),
      messageId,
      message,
      isSend: false,
      sendedAt: new Date(),
      from_user: systemId,
      to_user: recipientId,
      senderName: "System",
      mobileNumber: recipientId,
    })
      .then((response) => {
        if (io) {
          console.log("reponse", response);
          io.emit("new_message", response);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });

    return res.status(200).json({ message: "Message sent and saved" });
  } catch (error) {
    console.error("Send message error:", error);
    return res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;

router.get("/messages/send/number/:contactNo", async (req, res) => {
  try {
    const { contactNo } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const user = await getUserByNumber(contactNo);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const data = await getMessagesByUserId(user._id.toString(), page, limit);
    return res.status(200).json(data);
  } catch (error) {
    console.error("Get messages by contactNo error:", error);
    return res.status(500).json({ error: "Failed to get messages" });
  }
});
