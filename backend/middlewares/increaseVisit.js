import Post from "../models/post.model.js";

const increaseVisit = async (req, res, next) => {
  const slug = req.params.slug;
  // Find Post by slug and increase visit field by 1
  await Post.findOneAndUpdate({ slug }, { $inc: { visit: 1 } });
  next();
};

export default increaseVisit;