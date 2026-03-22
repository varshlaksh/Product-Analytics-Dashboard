import express from "express";
import cors from "cors";
import authRoutes      from "./routes/auth.routes";
import trackRoutes     from "./routes/track.routes";
import analyticsRoutes from "./routes/analytics.routes";

const app = express();

// ✅ CORS — reads from environment variable
app.use(cors({
  origin: function(origin, callback) {
    // allow no origin (Postman, curl)
    if (!origin) return callback(null, true)

    const allowed = [
      "http://localhost:5173",
      "http://localhost:5174",
      process.env.FRONTEND_URL || "",
    ].filter(Boolean)

    // allow any vercel.app URL automatically
    if (origin.endsWith(".vercel.app")) {
      return callback(null, true)
    }

    if (allowed.includes(origin)) {
      return callback(null, true)
    }

    console.log(`CORS blocked: ${origin}`)
    callback(new Error(`CORS blocked: ${origin}`))
  },
  credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`)
  next()
})

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

app.use("/auth",      authRoutes)
app.use("/track",     trackRoutes)
app.use("/analytics", analyticsRoutes)

export default app