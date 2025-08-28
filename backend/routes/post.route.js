import express from 'express';
import { getPosts, getPost, createPost, deletePost, uploadAuth, featurePost, updatePost } from "../controllers/post.controller.js";
import increaseVisit from "../middlewares/increaseVisit.js";

const router = express.Router();

router.get("/upload-auth", uploadAuth);
router.get("/", getPosts);
router.get("/:slug", increaseVisit, getPost);
router.post("/", createPost);
router.delete("/:id", deletePost);
router.patch("/feature", featurePost);
router.patch("/:slug", updatePost);

export default router;