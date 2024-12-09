import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JSON;

export async function GenerateToken(req: Request, res: Response) {
  const token = req.headers["authorization"];
  if (!token) {
    res.status(403).json({ error: "no token" });
    return;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET as string);
  } catch (error) {
    res.status(403).json({ error: "invalid token" });
    return;
  }
  res.status(200).json({ message: "ok" });
  return;
}
