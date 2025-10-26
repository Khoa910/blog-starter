import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    comment: { type: Schema.Types.ObjectId, ref: "Comment", required: true },
  },
  { timestamps: true }
);

//Create a "compound index" (combined index) on 2 fields (user, comment)
// - { user: 1, comment: 1 } : 1 = ascending, used to determine the index (not to sort when querying)
// - { Unique: true } : ensures each pair (user, comment) is UNIQUE
likeSchema.index({ user: 1, comment: 1 }, { unique: true });

export default mongoose.model("Like", likeSchema);


