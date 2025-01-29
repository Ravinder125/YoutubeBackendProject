import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    text: { type: String, required: true, minlength: 1 },
    video: { type: Schema.Types.ObjectId, ref: 'Video', required: true, index: true }, /* added index for frequent queries fetching comments by video benfit from indexing */
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    isDelete: true
}, { timestamps: true })

const Comment = mongoose.model('Comment', commentSchema)
export default Comment;