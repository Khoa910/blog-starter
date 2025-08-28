import express from 'express';
import { putLike, deleteLike } from "../controllers/like.controller.js";

const router = express.Router();

router.put("/:commentId", putLike);
router.delete("/:commentId", deleteLike);

export default router;