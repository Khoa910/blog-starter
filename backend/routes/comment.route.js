import express from 'express';
import { addComment, deleteComment, getPostComments, replyToComment } from "../controllers/comment.controller.js";

const router = express.Router();

router.get("/:postId", getPostComments);
router.post("/:postId", addComment);
router.post("/:commentId/reply", replyToComment);
router.delete("/:id", deleteComment);

export default router;