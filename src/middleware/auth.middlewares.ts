import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { prismaClient } from "../db/prisma";
import { JWT_SECRET } from "../utils/secrets";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization!;
  // If no token throw unauuthorized error
  if (!token) {
    throw new Error("Unauthorized");
    // next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
  }
  try {
    // If token present verify token and extract payload
    const payload = jwt.verify(token, JWT_SECRET!) as any;
    // Get the user from payload
    const user = await prismaClient.users.findFirst({
      where: { user_id: payload.user_id },
    });
    if (!user) {
      throw new Error("Unauthorized");
      //   next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
    }
    // attach the user to current req object
    req.user = user!;

    next();
  } catch (error) {
    throw new Error("Unauthorized");
    // next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
  }
};

export default authMiddleware;
