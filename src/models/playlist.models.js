import mongoose, { Schema } from "mongoose";

const playlistSchema = new Schema({
    name: {
        type: String,
        trim: true,
        maxlength: [50, "Name cannot exceed 50 characters"],
        default: "Playlist"
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
    }],
    isPublic: {
        type: Boolean,
        default: true,
    }

}, { timestamps: true });

export const Playlist = mongoose.model('Playlist', playlistSchema);
