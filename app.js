import express from "express";
import cookieParser from "cookie-parser";
import ht from "helmet";
import cors from "cors";
const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(ht());
app.use(cors())

import postsRouter from "./src/routers/posts.router.js"
import userRouter from "./src/routers/user.router.js"
import userComment from "./src/routers/comment.router.js"
import helmet from "helmet";
app.use("/api/user",userRouter)
app.use("/api/user",postsRouter)
app.use("/api/user",userComment)


export {app}