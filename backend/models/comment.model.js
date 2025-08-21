import { Schema } from "mongoose";
import mongoose from "mongoose";

const commentSchema = new Schema({
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
        // If this comment is a reply to another comment, store the parent comment id
        replyId: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
        desc: { type: String, required: true },
        // Likes moved to Like model; do not keep counters here
    },
    {timestamps: true} // Automatically manage createdAt and updatedAt fields
);

export default mongoose.model("Comment", commentSchema);