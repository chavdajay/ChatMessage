// WhatsApp Webhook + Messaging Handler with Socket.IO support

import { Router } from "express";
import { getUserByNumber, saveUser, User } from "../../modules/user";
import {
  Message,
  saveMessage,
  MessageModel,
  updateMessage,
} from "../../modules/message";
import { getSocketIO } from "../../socketHandler";

const router = Router();

// GET Webhook Verification
router.get("/webhook", (req, res) => {
  const {
    "hub.mode": mode,
    "hub.verify_token": token,
    "hub.challenge": challenge,
  } = req.query;

  if (mode === "subscribe" && token === "token") {
    return res.status(200).send(challenge);
  }
  return res.status(403).send("Forbidden");
});

// POST Webhook Listener
router.post("/webhook", async (req, res) => {
  const io = getSocketIO();
  try {
    const value = req.body?.entry?.[0]?.changes?.[0]?.value;
    if (!value) return res.status(400).json({ error: "Invalid webhook payload" });

    // Handle incoming messages
    if (value.messages) {
      const message = value.messages[0];
      const { id: messageId, from, text } = message;
      const messageText = text?.body || "";
      const senderName = value.contacts?.[0]?.profile?.name || "Unknown";

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

      const savedMsg = await saveMessage(
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
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      );

      if (io) io.emit("new_message", savedMsg);
      return res.status(200).json({ status: "OK" });
    }

    // Handle message statuses
    if (value.statuses) {
      const status = value.statuses[0];
      const message = await MessageModel.findOne({ messageId: status.id });

      if (message) {
        const updatedMessage = new Message(message);
        const statusUpdates = {
          sent: { isSend: true, sendedAt: new Date() },
          delivered: { isDelivered: true, deliveredAt: new Date() },
          read: { isSeen: true, seenAt: new Date() },
        };
       const statusType = status.status as "sent" | "delivered" | "read";
        Object.assign(updatedMessage, statusUpdates[statusType] || {});
        const updated = await updateMessage(updatedMessage);

        if (io) io.emit("new_message", updated);
      }
    }

    return res.status(200).json({ status: "OK" });
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;