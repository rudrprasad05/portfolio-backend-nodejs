import prisma from "../../db/prisma";
import { Request, Response } from "express";

export async function NewCategory(req: Request, res: Response) {
  const { name } = req.body;
  const tag = await prisma.category.create({
    data: {
      name,
    },
  });
  res.status(200).json({ message: "ok", category: tag });
  return;
}
