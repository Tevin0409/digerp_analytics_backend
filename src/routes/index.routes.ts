import { Router } from "express";
import authRoutes from "./auth.routes";
// Combines all the routes into one large route file
const rootRouter: Router = Router();

rootRouter.use("/auth", authRoutes);
export default rootRouter;
