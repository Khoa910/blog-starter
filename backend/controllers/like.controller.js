import User from "../models/user.model.js";
import Like from "../models/like.model.js";

export const putLike = async (req, res) => {
    const clerkUserId = req.auth().userId;
    if (!clerkUserId) {
        return res.status(401).json("Not authenticated!");
    }

    const user = await User.findOne({ clerkUserId }).select("_id");
    if (!user) {
        return res.status(404).json("User not found");
    }

    const { commentId } = req.params;
    await Like.create({ user: user._id, comment: commentId });
    const count = await Like.countDocuments({ comment: commentId }); // Count total number of likes for comment
    res.json({ isLiked: true, liked: count });
};

export const deleteLike = async (req, res) => {
    const clerkUserId = req.auth().userId;
    if (!clerkUserId) {
        return res.status(401).json("Not authenticated!");
    }

    const user = await User.findOne({ clerkUserId }).select("_id");
    if (!user) {
        return res.status(404).json("User not found");
    }

    const { commentId } = req.params;
    await Like.deleteOne({ user: user._id, comment: commentId });
    const count = await Like.countDocuments({ comment: commentId });
    res.json({ isLiked: false, liked: count });
};