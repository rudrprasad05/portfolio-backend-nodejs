import prisma from "../../db/prisma";
import { Request, Response } from "express";

export async function GetAllCategory(req: Request, res: Response) {
  const category = await prisma.category.findMany();

  if (!category) {
    res.status(400).json({ message: "no category", category: [] });
    return;
  }

  res.status(200).json({ message: "not ok", category: category });
  return;
}
