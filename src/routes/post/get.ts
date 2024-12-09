import prisma from "../../db/prisma";
import { Request, Response } from "express";

export async function GetAllPosts(req: Request, res: Response) {
  const posts = await prisma.post.findMany();

  if (!posts) {
    res.status(200).json({ message: "no posts" });
    return;
  }
  if (posts.length <= 0) {
    res.status(200).json({ message: "ok", posts: [] });
    return;
  }
  res.status(200).json({ message: "ok", posts: posts });
  return;
}
