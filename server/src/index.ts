import "dotenv/config";
import express from "express";
import cors from "cors";
import { requireAuth } from "./middleware/auth";
import clientsRouter from "./routes/clients";
import jobsRouter from "./routes/jobs";
import invoicesRouter from "./routes/invoices";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

// Health check (no auth needed)
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// All API routes require authentication
app.use("/api/clients", requireAuth, clientsRouter);
app.use("/api/jobs", requireAuth, jobsRouter);
app.use("/api/invoices", requireAuth, invoicesRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
