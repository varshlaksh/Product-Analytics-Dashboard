import { Router } from "express";
import { trackFeature } from "../controllers/track.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware, trackFeature);

export default router;