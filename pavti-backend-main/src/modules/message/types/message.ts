import { isUndefined, omitBy } from "lodash";
import { Types } from "mongoose";
import { IUser } from "../../user";

export interface IMessage {
  _id?: string;
  recordId?: string;
  user?: number;
  userId?: string | IUser;
  messageId: string;
  message?: string;
  errorMessage?: string;
  isSend: boolean;
  sendedAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  isReceived: boolean;
  isSeen: boolean;
  seenAt?: Date;
  senderName?: string;
  conversationId?: string;
  hasAttachment: boolean;
  mobileNumber?: number;
  event?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Message implements IMessage {
  _id?: string;
  recordId?: string;
  user?: number;
  userId?: string | IUser;
  messageId: string;
  message?: string;
  errorMessage?: string;
  isSend: boolean;
  sendedAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  isReceived: boolean;
  isSeen: boolean;
  seenAt?: Date;
  senderName?: string;
  conversationId?: string;
  hasAttachment: boolean;
  mobileNumber?: number;
  event?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(input?: IMessage) {
    this._id = input?._id
      ? input._id.toString()
      : new Types.ObjectId().toString();
    this.recordId = input?.recordId;
    this.user = input?.user;
    this.userId = input?.userId;
    this.messageId = input?.messageId || "";
    this.message = input?.message;
    this.errorMessage = input?.errorMessage;
    this.isSend = input?.isSend ?? false;
    this.sendedAt = input?.sendedAt;
    this.isDelivered = input?.isDelivered ?? false;
    this.deliveredAt = input?.deliveredAt;
    this.isReceived = input?.isReceived ?? false;
    this.isSeen = input?.isSeen ?? false;
    this.seenAt = input?.seenAt;
    this.senderName = input?.senderName;
    this.conversationId = input?.conversationId;
    this.hasAttachment = input?.hasAttachment ?? false;
    this.mobileNumber = input?.mobileNumber;
    this.event = input?.event;
    this.createdAt = input?.createdAt;
    this.updatedAt = input?.updatedAt;
  }

  toJSON() {
    return omitBy(this, isUndefined);
  }
}
