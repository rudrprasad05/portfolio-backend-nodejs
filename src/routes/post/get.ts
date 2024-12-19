import { Request, Response } from "express";

import prisma from "../../db/prisma";

export async function GetAllPosts(req: Request, res: Response) {
  const posts = await prisma.post.findMany({
    include: {
      postCategories: {
        include: {
          category: true,
        },
      },
    },
  });

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

export async function GetSinglePost(req: Request, res: Response) {
  const { id } = req.query;
  const posts = await prisma.post.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      postCategories: {
        include: {
          category: true,
        },
      },
      content: true,
      featuredImage: true,
      author: true,
    },
  });

  if (!posts) {
    res.status(200).json({ message: "no posts" });
    return;
  }

  res.status(200).json({ message: "ok", post: posts });
  return;
}
