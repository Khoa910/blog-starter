import { Schema } from "mongoose";
import mongoose from "mongoose";

const commentSchema = new Schema({
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
        desc: { type: String, required: true },
    },
    {timestamps: true} // Automatically manage createdAt and updatedAt fields
);

export default mongoose.model("Comment", commentSchema);