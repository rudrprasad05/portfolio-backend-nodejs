import prisma from "../../db/prisma";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JSON;

async function getUserById(email: string) {
  // Simulate a database fetch
  const res = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  return res;
}

export async function GenerateToken(req: Request, res: Response) {
  const token = req.headers["authorization"];
  if (!token) {
    res.status(403).json({ error: "no token" });
    return;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as {
      userId: string;
    };
    const user = await getUserById(decoded.userId);
    res.status(200).json({ message: "ok", user });
  } catch (error) {
    res.status(403).json({ error: "invalid token" });
    return;
  }
  return;
}
