import { isUndefined, omitBy } from "lodash";
import { Types } from "mongoose";

export interface IUser {
  _id?: string;
  fullName: string;
  email?: string;
  contactNo?: string;
  isTempName?: boolean;
  isApprove: "pending" | "approved" | "rejected";
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User implements IUser {
  _id: string;
  fullName: string;
  email?: string;
  contactNo?: string;
  isTempName?: boolean;
  isApprove: "pending" | "approved" | "rejected";
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(input?: IUser) {
    this._id = input?._id
      ? input._id.toString()
      : new Types.ObjectId().toString();
    this.fullName = input?.fullName || "";
    this.email = input?.email;
    this.contactNo = input?.contactNo;
    this.isTempName = input?.isTempName;
    this.isApprove = input?.isApprove || "pending";
    this.isActive = input?.isActive ?? true;
    this.createdAt = input?.createdAt;
    this.updatedAt = input?.updatedAt;
  }

  toJSON() {
    return omitBy(this, isUndefined);
  }
}
