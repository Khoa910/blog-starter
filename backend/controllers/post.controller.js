import ImageKit from "imagekit";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Comment from "../models/comment.model.js";

export const getPosts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;

    //Create an empty query object → will be used to pass into MongoDB find()
    const query = {};
    const cat = req.query.cat;
    const author = req.query.author;
    const searchQuery = req.query.search;
    const sortQuery = req.query.sort;
    const featured = req.query.featured;

    //If there is a cat param, add the category = cat condition to the query
    if (cat) {
        query.category = cat;
    }

    //If there is a search, find the title containing the string searchQuery (case-insensitive thanks to $options: "i")
    if (searchQuery) {
        query.title = { $regex: searchQuery, $options: "i" };
    }

    //Find the author. If found, only get posts from that user
    if (author) {
        const user = await User.findOne({ username: author }).select("_id");
        if (!user) {
            return res.status(404).json("No post found!");
        }
        query.user = user._id;
    }

    //Default sort by latest created date
    let sortObj = { createdAt: -1 };
    if (sortQuery) {
        switch (sortQuery) {
        case "newest":
            sortObj = { createdAt: -1 };
            break;
        case "oldest":
            sortObj = { createdAt: 1 };
            break;
        case "popular":
            sortObj = { visit: -1 };
            break;
        case "trending":
            sortObj = { visit: -1 };
            query.createdAt = { $gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000) };
            break;
        default:
            break;
        }
    }

    //If there is a featured, only take the featured article.
    if (featured) {
        query.isFeatured = true;
    }

    const posts = await Post.find(query)
        .populate("user", "username")
        .sort(sortObj)
        .limit(limit)
        .skip((page - 1) * limit);
    const totalPosts = await Post.countDocuments(query);
    const totalPages = Math.ceil(totalPosts / limit);

    res.status(200).json({
        posts,
        currentPage: page,
        totalPages,
        totalPosts,
        hasMore: page < totalPages,
    });
};

export const getPost = async (req, res) => { 
    const post = await Post.findOne({slug:req.params.slug}).populate("user","username img");
    res.status(200).json(post);
};

export const createPost = async (req, res) => {
    const clerkUserId = req.auth().userId;
    if(!clerkUserId){
        return res.status(401).json("not authenticated");
    }

    const user = await User.findOne({ clerkUserId });
    if(!user){
        return res.status(404).json("User not found");
    }

    let slug = req.body.title.replace(/ /g, "-").toLowerCase()
    let existingPost = await Post.findOne({ slug });

    // if the name post is same, bonus number behind the end of slug
    let counter = 1;
    while(existingPost){
        slug = `${slug}-${counter}`;
        existingPost = await Post.findOne({ slug });
        counter++;
    }

    const newPost = new Post({ user: user._id, slug, ...req.body });

    const post = await newPost.save();
    res.status(200).json(post);
};

export const deletePost = async (req, res) => {
    const clerkUserId = req.auth().userId;
    if (!clerkUserId) {
        return res.status(401).json("not authenticated");
    }

    const role = req.auth.sessionClaims?.metadata?.role || "user";
    let deletedPost;

    if (role === "admin") {
        deletedPost = await Post.findByIdAndDelete(req.params.id);
    } else {
        const user = await User.findOne({ clerkUserId });
        deletedPost = await Post.findOneAndDelete({ _id: req.params.id, user: user._id });
        if (!deletedPost) {
        return res.status(403).json({ message: "You can delete only your posts!" });
        }
    }

    if (!deletedPost) {
        return res.status(404).json({ message: "Post not found" });
    }

    await Comment.deleteMany({ post: deletedPost._id });
    await User.updateMany(
        { savedPosts: deletedPost._id.toString() },
        { $pull: { savedPosts: deletedPost._id.toString() } }
    );

    res.status(200).json({ message: "Post deleted successfully" });
};

export const updatePost = async (req, res) => {
    const clerkUserId = req.auth().userId;
    if (!clerkUserId) return res.status(401).json("Not authenticated");

    const user = await User.findOne({ clerkUserId });
    if (!user) return res.status(404).json("User not found");

    const post = await Post.findOne({ slug: req.params.slug });
    //const post = await Post.findById(req.params.id);
    //console.log("Found post:", post);
    if (!post) return res.status(404).json("Post not found");

    const role = req.auth.sessionClaims?.metadata?.role || "user";
    if (role !== "admin" && !post.user.equals(user._id)) {
        return res.status(403).json("You can edit only your posts!");
    }

    // Update slug nếu title thay đổi
    let newSlug = post.slug;
    if (req.body.title && req.body.title !== post.title) {
        newSlug = req.body.title.replace(/ /g, "-").toLowerCase();
        let existingPost = await Post.findOne({ slug: newSlug });
        let counter = 1;
        while (existingPost && !existingPost._id.equals(post._id)) {
            newSlug = `${newSlug}-${counter}`;
            existingPost = await Post.findOne({ slug: newSlug });
            counter++;
        }
    }

    // Update các field
    post.title = req.body.title ?? post.title;
    post.desc = req.body.desc ?? post.desc;
    post.content = req.body.content ?? post.content;
    post.slug = newSlug;

    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
};


export const featurePost = async (req, res) => {
    const clerkUserId = req.auth().userId;
    const postId = req.body.postId;
    if (!clerkUserId) {
        return res.status(401).json("Not authenticated!");
    }

    const role = req.auth.sessionClaims?.metadata?.role || "user";
    if (role !== "admin") {
        return res.status(403).json("You cannot feature posts!");
    }

    const post = await Post.findById(postId);
    if (!post) {
        return res.status(404).json("Post not found!");
    }

    const isFeatured = post.isFeatured;
    const updatedPost = await Post.findByIdAndUpdate( postId, { isFeatured: !isFeatured }, { new: true });
    res.status(200).json(updatedPost);
};

const imagekit = new ImageKit({
    urlEndpoint: process.env.IK_URL_ENDPOINT,
    publicKey: process.env.IK_PUBLIC_KEY,
    privateKey: process.env.IK_PRIVATE_KEY
});

export const uploadAuth = async (req, res) => {
    const result = imagekit.getAuthenticationParameters();
    res.status(200).json(result);
};