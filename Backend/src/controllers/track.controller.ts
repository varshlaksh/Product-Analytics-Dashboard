import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";

const prisma = new PrismaClient();

export const trackFeature = async (req: AuthRequest, res: Response) => {
  try {
    const { feature_name } = req.body;

    if (!feature_name) {
      return res.status(400).json({ error: "feature_name is required" });
    }

    await prisma.featureClick.create({
      data: {
        feature_name,
        user_id: req.user.userId,
      },
    });

    return res.json({ message: "Tracked successfully" });
  } catch (error) {
    console.error("TRACK ERROR:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};