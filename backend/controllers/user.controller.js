import User from "../models/user.model.js";
import Post from "../models/post.model.js";

export const getUserSavedPosts = async (req, res) => {
    const clerkUserId = req.auth().userId;
    if (!clerkUserId) {
      return res.status(401).json("Not authenticated!");
    }

    const user = await User.findOne({ clerkUserId });
    res.status(200).json(user.savedPosts);
  };

  export const savePost = async (req, res) => {
    const clerkUserId = req.auth().userId;
    const postId = req.body.postId;
    if (!clerkUserId) {
      return res.status(401).json("Not authenticated!");
    }

    const user = await User.findOne({ clerkUserId });
    const isSaved = user.savedPosts.some((p) => p === postId);

    //save or cancel save a post
    if (!isSaved) {
      await User.findByIdAndUpdate(user._id, {
        $push: { savedPosts: postId },
      });
    } else {
      await User.findByIdAndUpdate(user._id, {
        $pull: { savedPosts: postId },
      });
    }
    res.status(200).json(isSaved ? "Post unsaved" : "Post saved");
};

export const getSavedPosts = async (req, res) => {
    const { userId, page = 1, limit = 10 } = req.query;

    if (!userId) return res.status(400).json({ message: "UserId required" });

    const user = await User.findOne({ clerkUserId: userId });
    if (!user) return res.status(404).json({ message: "User not found" });

    const savedPostIds = user.savedPosts;

    const skip = (page - 1) * limit;
    const posts = await Post.find({ _id: { $in: savedPostIds } })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean();

        console.log(posts);
    res.json({posts, hasMore: savedPostIds.length > page * limit});
};