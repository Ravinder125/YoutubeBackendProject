import mongoose, { Schema, Types } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({
    title: { type: String, trim: true, },
    description: { type: String, trim: true },
    videoUrl: { type: String, required: true, trim: true }, // Cloudinary URL
    duration: { type: Number, required: true }, // Duration in seconds
    thumbnail: { type: String, trim: true }, // Cloudinary URL
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tags: [{ type: String, trim: true, lowercase: true, index: true }],
    shared: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    saved: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    views: [{ type: Schema.Types.ObjectId, ref: "User" }],
    isPublished: { type: Boolean, default: false },
    isDelete: { type: Boolean, default: false, index: true }
}, { timestamps: true });

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema);

