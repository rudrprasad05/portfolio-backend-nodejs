import { Request, Response } from "express";

import { ContentType } from "types";

import prisma from "../../db/prisma";

interface RequestBody {
  contents: ContentType[];
  id: string;
}

export async function CreateContent(
  req: Request<{}, {}, RequestBody>,
  res: Response
) {
  const { contents, id } = req.body;

  for (let i = 0; i < contents.length; i++) {
    if (contents[i].id) {
      // Existing content: Use upsert
      await prisma.content.update({
        where: { id: contents[i].id },
        data: {
          data: contents[i].data,
          type: contents[i].type,
        },
      });
    } else {
      // New content: Use create
      await prisma.content.create({
        data: {
          data: contents[i].data,
          type: contents[i].type,
          postId: Number(id),
        },
      });
    }
  }

  res.status(200).json({ message: "ok" });
  return;
}
