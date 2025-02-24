import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new Schema({
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    content: {
        type: String,
        required: true,
        minlength: [1, "Comment must longer than 1 character"]
    },
    video: {
        type: Schema.Types.ObjectId,
        ref: 'Video',
        required: true,
        index: true
    }, /* added index for frequent queries fetching comments by video benfit from indexing */
    isDelete: {
        type: Boolean,
        default: false,
        index: true
    }
}, { timestamps: true })

commentSchema.plugin(mongooseAggregatePaginate)

export const Comment = mongoose.model('Comment', commentSchema)
