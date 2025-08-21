import express from 'express';
import { clerkMiddleware } from "@clerk/express";
import { getMyLikeState, putMyLike, deleteMyLike, getLikeCount } from "../controllers/like.controller.js";

const router = express.Router();

router.use(clerkMiddleware());

router.get("/:commentId/me", getMyLikeState);
router.put("/:commentId/me", putMyLike);
router.delete("/:commentId/me", deleteMyLike);
router.get("/:commentId/count", getLikeCount);

export default router;


