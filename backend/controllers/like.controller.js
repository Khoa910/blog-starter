import User from "../models/user.model.js";
import Comment from "../models/comment.model.js";
import Like from "../models/like.model.js";

export const getMyLikeState = async (req, res) => {
    const clerkUserId = req.auth().userId;
    if (!clerkUserId) {
        return res.status(401).json("Not authenticated!");
    }

    const user = await User.findOne({ clerkUserId }).select("_id");
    if (!user) { 
        return res.status(404).json("User not found");
    }
    
    const { commentId } = req.params;
    const exists = await Like.exists({ user: user._id, comment: commentId });
    res.json({ isLiked: !!exists });
};

export const putMyLike = async (req, res) => {
    const clerkUserId = req.auth().userId;
    if (!clerkUserId) return res.status(401).json("Not authenticated!");
    const user = await User.findOne({ clerkUserId }).select("_id");
    if (!user) return res.status(404).json("User not found");
    const { commentId } = req.params;
    // create like (idempotent)
    try { await Like.create({ user: user._id, comment: commentId }); } catch (_) {}
    const count = await Like.countDocuments({ comment: commentId });
    res.json({ isLiked: true, liked: count });
};

export const deleteMyLike = async (req, res) => {
    const clerkUserId = req.auth().userId;
    if (!clerkUserId) return res.status(401).json("Not authenticated!");
    const user = await User.findOne({ clerkUserId }).select("_id");
    if (!user) return res.status(404).json("User not found");
    const { commentId } = req.params;
    // delete like (idempotent)
    await Like.deleteOne({ user: user._id, comment: commentId });
    const count = await Like.countDocuments({ comment: commentId });
    res.json({ isLiked: false, liked: count });
};

export const getLikeCount = async (req, res) => {
    const { commentId } = req.params;
    const count = await Like.countDocuments({ comment: commentId });
    res.json({ liked: count });
};


