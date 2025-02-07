import mongoose, { Schema } from "mongoose";

const playlistSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: [2, "Name must be at least 2 character long"],
        maxlength: [50, "Name cannote exceed 50 characters"]
    },
    description: {
        type: String,
        trim: true,
        maxlength: [200, "Descritpion cannot exceed 200 characters"],
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    videos: [{
        type: Schema.Types.ObjectId,
        ref: 'Video',
        required: true,
        default: [],
    }],
    isPublic: {
        type: Boolean,
        default: true,
    }

}, { timestamps: true });

const Playlist = mongoose.model('Playlist', playlistSchema);
export { Playlist };