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

    res.status(201).json(savedComment);
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

    const user = await User.findOne({clerkUserId});

    const deletedComment = await Comment.findOneAndDelete({_id: id, user: user._id});

    if(!deletedComment){
        return res.status(403).json("You can only delete your own comments");
    }

    res.status(200).json("Comment deleted successfully");
};