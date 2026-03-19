import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import trackRoutes from "./routes/track.routes";
import analyticsRoutes from "./routes/analytics.routes"
const app = express();

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use("/auth", authRoutes);
app.use("/track", trackRoutes);
app.use("/analytics", analyticsRoutes)


export default app;
