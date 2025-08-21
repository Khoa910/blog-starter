import express from 'express';
import { addComment, deleteComment, getPostComments, replyToComment, likeComment, unlikeComment } from "../controllers/comment.controller.js";

const router = express.Router();

router.get("/:postId", getPostComments);
router.post("/:postId", addComment);
router.post("/:commentId/reply", replyToComment);
router.delete("/:id", deleteComment);
router.post("/:commentId/like", likeComment);
router.post("/:commentId/unlike", unlikeComment);

export default router;