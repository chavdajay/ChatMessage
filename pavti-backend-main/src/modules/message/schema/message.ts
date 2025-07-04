import { Schema, Types, model } from "mongoose";
import { IMessage } from "../types";

const message = new Schema<IMessage>(
  {
    recordId: {
      type: String,
    },
    user: {
      type: Number,
    },
    userId: {
      type: Types.ObjectId,
      ref: "user",
    },
    messageId: {
      type: String,
      required: true,
      maxlength: 80,
    },
    message: {
      type: String,
    },
    errorMessage: {
      type: String,
    },
    isSend: {
      type: Boolean,
      default: false,
    },
    sendedAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    isReceived: {
      type: Boolean,
      default: false,
    },
    isSeen: {
      type: Boolean,
      default: false,
    },
    seenAt: {
      type: Date,
    },
    senderName: {
      type: String,
      maxlength: 80,
    },
    conversationId: {
      type: String,
      maxlength: 80,
    },
    hasAttachment: {
      type: Boolean,
      default: false,
    },
    isPavti: {
      type: Boolean,
      default: false,
    },
    isRasoi: {
      type: Boolean,
      default: false,
    },
    isError: {
      type: Boolean,
      default: false,
    },
    mobileNumber: {
      type: Number,
    },
    event: {
      type: Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

export const MessageModel = model<IMessage>("message", message);
