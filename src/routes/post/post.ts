import { Request, Response } from "express";

import prisma from "../../db/prisma";

export async function NewPost(req: Request, res: Response) {
  const { title, categoryId, userId } = req.body;

  const post = await prisma.post.create({
    data: {
      title,
      authorId: userId,
    },
  });
  const pC = await prisma.postCategory.create({
    data: {
      postId: post.id,
      categoryId: categoryId,
    },
  });

  res.status(200).json({ message: "ok", post: "post" });
  return;
}

export async function UpdatePost(req: Request, res: Response) {
  const { id, data } = req.body;

  const post = await prisma.post.update({
    where: {
      id: Number(id),
    },

    data,
  });

  res.status(200).json({ message: "ok", post: "" });
  return;
}
