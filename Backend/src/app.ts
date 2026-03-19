import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
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


export default app;
