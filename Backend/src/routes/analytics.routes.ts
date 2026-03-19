import { Router } from "express";
import { getAnalytics } from "../controllers/analytics.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authMiddleware, getAnalytics);

export default router;