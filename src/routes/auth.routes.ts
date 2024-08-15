import { Router } from "express";
import { login, getUserInfo } from "../controllers/auth.controller";
import authMiddleware from "../middleware/auth.middlewares";
import { errorHandler } from "../utils/error-handler";

const authRoutes: Router = Router();

authRoutes.post("/login", errorHandler(login));
authRoutes.get("/user", [authMiddleware], errorHandler(getUserInfo));
export default authRoutes;
