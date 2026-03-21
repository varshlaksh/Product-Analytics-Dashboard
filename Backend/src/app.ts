import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import trackRoutes from "./routes/track.routes";
import analyticsRoutes from "./routes/analytics.routes";

const app = express();

// ✅ CORS must be FIRST — before every route
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/track", trackRoutes);
app.use("/analytics", analyticsRoutes);

export default app;