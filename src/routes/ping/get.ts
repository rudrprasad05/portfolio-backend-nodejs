import { Request, Response } from "express";
import pool from "../../db";

export async function Ping(req: Request, res: Response) {
  try {
    const [rows] = await pool.query("SELECT 1");
    res.json({ message: "Pong", rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database connection failed" });
  }
}
