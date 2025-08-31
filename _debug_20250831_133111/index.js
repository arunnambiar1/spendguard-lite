import express from "express";
import cors from "cors";
import pool from "./db.js";
import authRouter, { authenticate } from "./auth.js";
import transactionsRouter from "./transactions.js";
import alertsRouter from "./alerts.js";
import { onError } from "./middleware/errors.js";

const app = express();
app.use(cors());
app.use(express.json());

// health
app.get("/health", (_req, res) => res.json({ ok: true }));

// public auth
app.use("/auth", authRouter);

// everything below is protected
app.use(authenticate);
app.use("/transactions", transactionsRouter);
app.use("/alerts", alertsRouter);

// centralized error handler
app.use(onError);

// bind explicitly to IPv4 host + port so the SPA can reach it
const port = Number(process.env.PORT) || 3002;
const host = process.env.HOST || "127.0.0.1";
app.listen(port, host, () => console.log(`API running on http://${host}:${port}`));