import mongoose, { Schema, Types } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    videoUrl: { type: String, required: true, trim: true }, // cloudinary url
    duration: { type: Number, required: true }, // Cloudinary 
    thumbnail: { type: String, }, /* Cloudinary */
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User', default: 0 }],
    dislikes: [{ type: Types.ObjectId, ref: 'User', default: 0 }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment', default: 0 }], // Reference Comment model
    tags: [{ type: String, trim: true, lowercase: true, index: true, default: 0 }],
    shared: [{ type: Schema.Types.ObjectId, ref: 'User', default: 0 }],
    saved: [{ type: Schema.Types.ObjectId, ref: 'User', default: 0 }],
    views: [{ type: Schema.Types.ObjectId, ref: "User" }],
    status: { type: String, enum: ["PENDING", "PRIVATE", "PUBLIC"], default: "PENDING", required: true }
}, { timestamps: true });

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema);

