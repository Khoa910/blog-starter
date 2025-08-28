import Comment from "../models/comment.model.js";
import User from "../models/user.model.js";
import Like from "../models/like.model.js";

export const getPostComments = async (req, res) => {
    const clerkUserId = req.auth().userId;
    let currentUser = null;
    if (clerkUserId) {
        currentUser = await User.findOne({ clerkUserId }).select("_id");
    }

    const comments = await Comment.find({ post: req.params.postId })
        .populate("user", "username img")
        .sort({ createdAt: -1 })
        .lean();

    const commentIds = comments.map((c) => c._id);
    const [likeCounts, myLikes] = await Promise.all([
        Like.aggregate([
            { $match: { comment: { $in: commentIds } } },
            { $group: { _id: "$comment", count: { $sum: 1 } } },
        ]),
        currentUser ? Like.find({ user: currentUser._id, comment: { $in: commentIds } }).select("comment").lean() : Promise.resolve([]),
    ]);

    const countMap = new Map(likeCounts.map((x) => [x._id.toString(), x.count]));
    const mySet = new Set(myLikes.map((l) => l.comment.toString()));

    const enriched = comments.map((thisComment) => ({
        ...thisComment,
        liked: countMap.get(thisComment._id.toString()) || 0,
        isLiked: mySet.has(thisComment._id.toString()),
    }));

    res.json(enriched);
};

export const addComment = async (req, res) => {
    const clerkUserId = req.auth().userId;
    const postId = req.params.postId;

    if (!clerkUserId) {
        return res.status(401).json("Not authenticated!");
    }

    const user = await User.findOne({ clerkUserId });
    const newComment = new Comment({
        ...req.body,
        user: user._id,
        post: postId,
    });

    const savedComment = await newComment.save();
    // include isLiked flag default false for new comment
    res.status(201).json({ ...savedComment.toObject(), liked: 0, isLiked: false });
};

export const replyToComment = async (req, res) => {
    const clerkUserId = req.auth().userId;
    const parentCommentId = req.params.commentId;

    if (!clerkUserId) {
        return res.status(401).json("Not authenticated!");
    }

    const user = await User.findOne({ clerkUserId });
    if (!user) {
        return res.status(404).json("User not found");
    }

    const parentComment = await Comment.findById(parentCommentId);
    if (!parentComment) {
        return res.status(404).json("Parent comment not found");
    }

    //Accept content from req.body.desc (or req.body.text for compatibility)
    const description = req.body?.desc || req.body?.text;
    if (!description || description.trim().length === 0) {
        return res.status(400).json("Reply text is required");
    }

    const replyComment = new Comment({
        user: user._id,
        post: parentComment.post, // use ObjectId from parent comment
        replyId: parentComment._id,
        desc: description,
    });

    const savedReply = await replyComment.save();
    return res.status(201).json({ ...savedReply.toObject(), liked: 0, isLiked: false });
};

export const editComment = async (req, res) => {
    const clerkUserId = req.auth().userId;
    const commentId = req.params.id;

    if (!clerkUserId) {
        return res.status(401).json("Not authenticated!");
    }

    const role = req.auth.sessionClaims?.metadata?.role || "user";
    const { desc } = req.body;

    if (!desc || desc.trim().length === 0) {
        return res.status(400).json("Description is required");
    }

    let updatedComment;
    if (role === "admin") {
        updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            { desc },
            { new: true }
        );
    } else {
        const user = await User.findOne({ clerkUserId });
        updatedComment = await Comment.findOneAndUpdate(
            { _id: commentId, user: user._id },
            { desc },
            { new: true }
        );
    }

    if (!updatedComment) {
        return res.status(404).json("Comment not found or not authorized");
    }

    res.status(200).json(updatedComment);
};

export const deleteComment = async (req, res) => {
    const clerkUserId = req.auth().userId;
    const id = req.params.id;

    if (!clerkUserId) {
        return res.status(401).json("not authenticated");
    }

    const role = req.auth.sessionClaims?.metadata?.role || "user";
    let deletedComment;

    if (role === "admin") {
        deletedComment = await Comment.findByIdAndDelete(id);
    } else {
        const user = await User.findOne({ clerkUserId });
        deletedComment = await Comment.findOneAndDelete({ _id: id, user: user._id });
        if (!deletedComment) {
            return res.status(403).json("You can only delete your own comments");
        }
    }

    if (!deletedComment) {
        return res.status(404).json("Comment not found");
    }
    await Comment.deleteMany({ replyId: deletedComment._id });

    res.status(200).json("Comment and its replies deleted successfully");
};

export const likeComment = async (req, res) => {
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
    const liked = await Like.countDocuments({ comment: commentId });
    const isLiked = !!(await Like.exists({ user: user._id, comment: commentId }));

    return res.status(200).json({ _id: commentId, liked, isLiked });
};

export const unlikeComment = async (req, res) => {
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
    const liked = await Like.countDocuments({ comment: commentId });
    const isLiked = !!(await Like.exists({ user: user._id, comment: commentId }));

    return res.status(200).json({ _id: commentId, liked, isLiked });
};