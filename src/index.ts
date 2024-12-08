import express from "express";
import dotenv from "dotenv";
import pool from "./db";
import { Logger, loggingMiddleware } from "@rudrprasad05/logs";
dotenv.config();

const app = express();
const logger = new Logger();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(loggingMiddleware(logger));

app.get("/ping", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1");
    res.json({ message: "Pong", rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
