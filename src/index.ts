import { Logger, loggingMiddleware } from "@rudrprasad05/logs";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { Login, Register } from "./routes/auth/post";
import { GenerateToken } from "./routes/token/post";
import { Ping } from "./routes/ping/get";
import { GetAllPosts } from "./routes/post/get";
import { GetAllCategory } from "./routes/category/get";

dotenv.config();

const app = express();
const logger = new Logger();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(loggingMiddleware(logger));
app.use(cors());

app.get("/admin", async () => {
  console.log("res");
});
app.get("/ping", Ping);
app.get("/posts", GetAllPosts);
app.get("/category", GetAllCategory);

app.post("/token", GenerateToken);
app.post("/auth/register", Register);
app.post("/auth/login", Login);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
