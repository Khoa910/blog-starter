import { Schema } from "mongoose";
import mongoose from "mongoose";

const postSchema = new Schema({
        img: { type: String },
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        savePosts: { type: [String], default: [] },
    },
    {timestamps: true} // Automatically manage createdAt and updatedAt fields
);

export default mongoose.model("Post", postSchema);
