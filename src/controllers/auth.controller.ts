import { NextFunction, Request, Response } from "express";
import { prismaClient } from "../db/prisma";
import * as crypto from "node:crypto";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/secrets";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { UnauthorizedException } from "../exceptions/unauthorized";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;
  const hashedpassword = crypto
    .createHash("md5")
    .update(password)
    .digest("hex");
  console.log("password", hashedpassword);

  let user = await prismaClient.users.findFirst({
    where: {
      user_id: username,
    },
  });

  if (!user) {
    // throw new Error("User not found");
    next(new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND));
  } else {
    if (user.password !== hashedpassword) {
      //   throw new Error("Incorrect password");
      next(
        new UnauthorizedException(
          "Incorrect password",
          ErrorCode.INCORRECT_PASSWORD
        )
      );
    }
    const token = jwt.sign({ user_id: user.user_id }, JWT_SECRET!);
    const token_date = new Date(Date.now() + 3600 * 1000).toISOString();
    console.log("token", token_date);
    console.log("user", user);
    console.log("time", new Date(Date.now() + 3600 * 1000).toISOString());

    const updatedUser = await prismaClient.users.update({
      where: {
        user_id: user.user_id,
      },
      data: {
        ...user,
        token,
        token_date: token_date,
      },
    });
    console.log("updatedUser", updatedUser);
    res.status(200).json({
      message: "Login successful",
      userInfo: {
        user_id: updatedUser.id,
        username: updatedUser.user_id,
        email: updatedUser.email,
        msisdn: updatedUser.phone,
        full_name: updatedUser.real_name,
        role_id: updatedUser.role_id,
      },
      token,
      tokenExpiry: updatedUser.token_date,
    });
  }
};

export const getUserInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userInfo = req.user;
  console.log("useerInfo", userInfo);

  const user = await prismaClient.users.findFirst({
    where: {
      user_id: userInfo?.user_id,
    },
  });
  if (!user) {
    next(new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND));
  } else {
    res.status(200).json({
      message: "User found",
      userInfo: {
        user_id: user.id,
        username: user.user_id,
        email: user.email,
        msisdn: user.phone,
        full_name: user.real_name,
        role_id: user.role_id,
      },
    });
  }
};
