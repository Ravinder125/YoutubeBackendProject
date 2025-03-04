import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const tweetSchema = new Schema({
    content: {
        type: String,
        required: [true, "Content is required"],
        trim: [true, "Conetent must be trimed"],
        minlength: [true, "Tweet must longer than 2 characters"]
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    isDelete: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

tweetSchema.plugin(mongooseAggregatePaginate)
export const Tweet = mongoose.model("Tweet", tweetSchema)