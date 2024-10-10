import { Router } from "express";
import { createPost, deletePost, getAllPosts, getMyAllPost, update_Post } from "../controllers/posts.controller.js";
import {verifyToken} from "../middleware/isLoggedIn.js"
const router=Router()
router.route("/create-post").post(verifyToken,createPost);
router.route('/update-post/:id').put(verifyToken, update_Post);
router.route('/delete-post/:id').delete(verifyToken, deletePost);
router.route('/user-post').get(verifyToken,getMyAllPost)
router.route('/').get(getAllPosts)


export default router;