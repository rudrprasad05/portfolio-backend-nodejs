import { Request, Response } from "express";

import prisma from "../../db/prisma";

export async function GetAllMedia(req: Request, res: Response) {
  const posts = await prisma.media.findMany();
  console.log(posts);

  if (!posts) {
    res.status(200).json({ message: "no posts" });
    return;
  }
  if (posts.length <= 0) {
    res.status(200).json({ message: "ok", media: [] });
    return;
  }
  res.status(200).json({ message: "ok", media: posts });
  return;
}
