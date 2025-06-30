import { Request as expresesRequest } from "express";
import { FileReference } from "typescript";

export interface Request extends expresesRequest {
  files: FileReference;
  isAdmin: boolean;
}
