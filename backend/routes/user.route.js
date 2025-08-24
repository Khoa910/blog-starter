import express from 'express';
import { getUserSavedPosts, savePost, getSavedPosts } from "../controllers/user.controller.js"

const router = express.Router();

router.get("/saved", getUserSavedPosts)
router.patch("/save", savePost)
router.get("/savedposts", getSavedPosts)

export default router;