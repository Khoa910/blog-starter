import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    comment: { type: Schema.Types.ObjectId, ref: "Comment", required: true },
  },
  { timestamps: true }
);

likeSchema.index({ user: 1, comment: 1 }, { unique: true });

export default mongoose.model("Like", likeSchema);


