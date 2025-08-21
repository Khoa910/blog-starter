import Comment from "../models/comment.model.js";
import User from "../models/user.model.js";
//import Post from "../models/post.model.js";

export const getPostComments = async (req, res) => {
    const comments = await Comment.find({ post: req.params.postId })
        .populate("user", "username img")
        .sort({ createdAt: -1 });

    res.json(comments);
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
    setTimeout(() => {
        res.status(201).json(savedComment);
    }, 3000);

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

    //Chấp nhận nội dung từ req.body.desc (hoặc req.body.text để tương thích)
    const description = req.body?.desc || req.body?.text;
    if (!description || description.trim().length === 0) {
        return res.status(400).json("Reply text is required");
    }

    const replyComment = new Comment({
        user: user._id,
        post: parentComment.post, // dùng ObjectId sẵn có từ bình luận cha
        replyId: parentComment._id,
        desc: description,
    });

    const savedReply = await replyComment.save();
    return res.status(201).json(savedReply);
};

// export const addComment = async (req, res) => {
//     try {
//         const clerkUserId = req.auth().userId;
//         const postId = req.params.postId;

//         if (!clerkUserId) {
//             return res.status(401).json("Not authenticated!");
//         }

//         const user = await User.findOne({ clerkUserId });
//         if (!user) {
//             return res.status(404).json("User not found");
//         }

//         const post = await Post.findById(postId);
//         if (!post) {
//             return res.status(404).json("Post not found");
//         }

//         const newComment = new Comment({
//             ...req.body,
//             user: user._id,
//             post: postId,
//         });

//         const savedComment = await newComment.save();

//         res.status(201).json(savedComment);
//     } catch (error) {
//         console.error("Add comment error:", error);
//         res.status(500).json({ message: error.message });
//     }
// };

export const deleteComment = async (req, res) => {
    const clerkUserId = req.auth().userId;
    const id = req.params.id;

    if(!clerkUserId){
        return res.status(401).json("not authenticated");
    }

    const role = req.auth.sessionClaims?.metadata?.role || "user";

    if (role === "admin") {
        await Comment.findByIdAndDelete(req.params.id);
        return res.status(200).json("Comment has been deleted");
    }

    const user = await User.findOne({clerkUserId});

    const deletedComment = await Comment.findOneAndDelete({_id: id, user: user._id});

    if(!deletedComment){
        return res.status(403).json("You can only delete your own comments");
    }

    res.status(200).json("Comment deleted successfully");
};

export const likeComment = async (req, res) => {
    try {
        const clerkUserId = req.auth().userId;
        if (!clerkUserId) {
            return res.status(401).json("Not authenticated!");
        }

        const { commentId } = req.params;
        const updated = await Comment.findByIdAndUpdate(
            commentId,
            { $inc: { liked: 1 } },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json("Comment not found");
        }

        return res.status(200).json({ liked: updated.liked, _id: updated._id });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const unlikeComment = async (req, res) => {
    try {
        const clerkUserId = req.auth().userId;
        if (!clerkUserId) {
            return res.status(401).json("Not authenticated!");
        }

        const { commentId } = req.params;
        // Decrement only if current liked > 0 to avoid negatives
        const decResult = await Comment.updateOne(
            { _id: commentId, liked: { $gt: 0 } },
            { $inc: { liked: -1 } }
        );

        if (decResult.matchedCount === 0) {
            // Either not found or already at 0
            const existing = await Comment.findById(commentId).select("liked");
            if (!existing) return res.status(404).json("Comment not found");
            return res.status(200).json({ liked: existing.liked, _id: existing._id });
        }

        const updated = await Comment.findById(commentId).select("liked");
        return res.status(200).json({ liked: updated.liked, _id: updated._id });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};