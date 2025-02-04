import express from "express";
import { users } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: users;
    }
  }
}
