import { Router } from "express";
import { getUserByNumber, saveUser, User } from "../../modules/user";
import {
  Message,
  saveMessage,
  MessageModel,
  updateMessage,
} from "../../modules/message";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Webhook
 *     description: WhatsApp webhook
 */

/**
 * @swagger
 * /api/webhook:
 *   get:
 *     summary: Verify webhook
 *     description: Responds to the webhook verification challenge from WhatsApp.
 *     tags: [Webhook]
 *     parameters:
 *       - in: query
 *         name: hub.mode
 *         schema:
 *           type: string
 *         required: true
 *         description: The mode of the subscription.
 *       - in: query
 *         name: hub.verify_token
 *         schema:
 *           type: string
 *         required: true
 *         description: The verification token.
 *       - in: query
 *         name: hub.challenge
 *         schema:
 *           type: string
 *         required: true
 *         description: The challenge to be returned.
 *     responses:
 *       200:
 *         description: Webhook verified successfully.
 *       403:
 *         description: Forbidden.
 */
router.get("/webhook", (req, res) => {
  const {
    "hub.mode": mode,
    "hub.verify_token": token,
    "hub.challenge": challenge,
  } = req.query;

  if (mode === "subscribe" && token === "token") {
    return res.status(200).json(parseInt(challenge as string));
  }
  return res.status(403).send("Forbidden");
});

/**
 * @swagger
 * /api/webhook:
 *   post:
 *     summary: Receive webhook notifications
 *     description: Receives and processes webhook notifications for messages and status updates from WhatsApp.
 *     tags: [Webhook]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Invalid webhook payload
 *       500:
 *         description: Internal Server Error
 */
router.post("/webhook", async (req, res) => {
  try {
    const { entry } = req.body;
    if (!entry?.[0]?.changes?.[0]?.value) {
      return res.status(400).json({ error: "Invalid webhook payload" });
    }

    const value = entry[0].changes[0].value;

    if ("messages" in value) {
      const message = value.messages[0];
      const { id: messageId, from, text } = message;
      const messageText = text?.body || "";
      const senderName = value.contacts?.[0]?.profile?.name || "";

      let user = await getUserByNumber(from);
      if (!user) {
        user = await saveUser(
          new User({
            fullName: senderName,
            email: "",
            contactNo: from,
            isApprove: "approved",
            isActive: true,
            isTempName: true,
          })
        );
      }

      await saveMessage(
        new Message({
          messageId,
          message: messageText,
          mobileNumber: parseInt(from),
          senderName: user.fullName,
          isReceived: true,
          isSend: false,
          isDelivered: false,
          isSeen: false,
          hasAttachment: false,
          event: message,
          userId: user._id.toString(),
        })
      );

      return res.status(200).json({ status: "OK" });
    }

    if ("statuses" in value) {
      const status = value.statuses[0];
      const message = await MessageModel.findOne({ messageId: status.id });

      if (message) {
        const updatedMessage = new Message(message);
        const statusMap: { [key: string]: { [key: string]: any } } = {
          sent: { isSend: true, sendedAt: new Date() },
          delivered: { isDelivered: true, deliveredAt: new Date() },
          read: { isSeen: true, seenAt: new Date() },
        };

        Object.assign(updatedMessage, statusMap[status.status] || {});
        await updateMessage(updatedMessage);
      }
    }

    return res.status(200).json({ status: "OK" });
  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
