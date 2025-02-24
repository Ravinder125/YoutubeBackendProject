import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const likeSchema = new Schema({
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    },
    video: {
        type: Schema.Types.ObjectId,
        ref: "Playlist"
    },
    tweet: {
        type: Schema.Types.ObjectId,
        ref: "Tweet"
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    isDislike: {
        type: Boolean, // soft delete functionality
        default: false
    }
}, { timestamps: true })

likeSchema.plugin(mongooseAggregatePaginate)

export const Like = mongoose.model("Like", likeSchema)