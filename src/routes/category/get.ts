import prisma from "../../db/prisma";
import { Request, Response } from "express";

export async function GetAllCategory(req: Request, res: Response) {
  const category = await prisma.category.findMany();

  if (!category) {
    res.status(200).json({ message: "no category" });
    return;
  }
  if (category.length <= 0) {
    res.status(200).json({ message: "ok", category: [] });
    return;
  }
  res.status(200).json({ message: "ok", category: category });
  return;
}
