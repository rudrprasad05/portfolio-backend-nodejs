import { Logger, loggingMiddleware } from "@rudrprasad05/logs";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import { Login, Register } from "./routes/auth/post";
import { GetAllCategory } from "./routes/category/get";
import { NewCategory } from "./routes/category/post";
import { CreateContent } from "./routes/content/post";
import { GetAllMedia } from "./routes/media/get";
import { Ping } from "./routes/ping/get";
import { GetAllPosts, GetSinglePost } from "./routes/post/get";
import { NewPost, UpdatePost } from "./routes/post/post";
import { GenerateToken } from "./routes/token/post";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const logger = new Logger();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(loggingMiddleware(logger));
app.use(cors());

app.get("/admin", async () => {});
app.get("/ping", Ping);
app.get("/posts", (req, res) => {
  const { id } = req.query;

  if (id) {
    return GetSinglePost(req, res); // Fetch a single post if 'id' is provided
  }

  return GetAllPosts(req, res);
});
app.get("/category", GetAllCategory);
app.get("/media", GetAllMedia);

app.post("/category/new", NewCategory);
app.post("/content/create", CreateContent);
app.post("/posts/new", NewPost);
app.post("/token", GenerateToken);
app.post("/auth/register", Register);
app.post("/auth/login", Login);

app.put("/post/update", UpdatePost);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
