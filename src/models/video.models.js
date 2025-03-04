import mongoose, { Schema, Types } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    videoUrl: { type: String, required: true, trim: true },
    duration: { type: Number, required: true },
    thumbnail: { type: String, trim: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    views: [{ type: Schema.Types.ObjectId, ref: "User" }],
    isPublished: { type: Boolean, default: false },
    isDelete: { type: Boolean, default: false, index: true }
}, { timestamps: true });

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema);

