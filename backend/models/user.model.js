import { Schema } from "mongoose";
import mongoose from "mongoose";

const userSchema = new Schema({
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        img: { type: String },
        savePosts: { type: [String], default: [] },
    },
    {timestamps: true} // Automatically manage createdAt and updatedAt fields
);

export default mongoose.model("User", userSchema);
