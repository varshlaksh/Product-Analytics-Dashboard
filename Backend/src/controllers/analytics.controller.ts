import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    const clicks = await prisma.featureClick.findMany({
      where: {
        timestamp: {
          gte: startDate ? new Date(startDate as string) : undefined,
          lte: endDate ? new Date(endDate as string) : undefined,
        },
      },
    });

    // 🔥 BAR CHART
    const barMap: Record<string, number> = {};

    clicks.forEach((click) => {
      barMap[click.feature_name] =
        (barMap[click.feature_name] || 0) + 1;
    });

    const barChart = Object.entries(barMap).map(
      ([feature, count]) => ({
        feature,
        count,
      })
    );

    // 🔥 LINE CHART
    const lineMap: Record<string, number> = {};

    clicks.forEach((click) => {
      const date = click.timestamp.toISOString().split("T")[0];
      lineMap[date] = (lineMap[date] || 0) + 1;
    });

    const lineChart = Object.entries(lineMap).map(
      ([date, count]) => ({
        date,
        count,
      })
    );

    return res.json({ barChart, lineChart });
  } catch (error) {
    console.error("ANALYTICS ERROR:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};