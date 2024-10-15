import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import { limiter } from "./src/middleware/rate.limiting.js";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use("/api", limiter);

import postsRouter from "./src/routers/posts.router.js";
import userRouter from "./src/routers/user.router.js";
import userComment from "./src/routers/comment.router.js";
import { redisClient } from "./src/helper/client.js";
app.use(helmet());
app.use("/api/user", redisClient.route(), userRouter);
app.use("/api/user", redisClient.route(), postsRouter);
app.use("/api/user", redisClient.route(), userComment);

export { app };
