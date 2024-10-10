import {Router}  from "express";
import {getComments , createComment, showComment, updateComment, deleteComment } from "../controllers/comment.controller.js";
import { verifyToken } from "../middleware/isLoggedIn.js";
const router=Router();
router.route('/comments').get(getComments);
router.route('/add-comment/:id').post(verifyToken,createComment);
router.route('/show-comment').get(showComment);
router.route('/update/:id').put(updateComment);
router.route('/delete/:commentId').delete(deleteComment);

export default router;