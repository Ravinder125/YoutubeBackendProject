import mongoose from "mongoose";
import { Like } from "../models/like.models.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { videoId } = req.params;

    if (!userId) throw new apiError(401, "Unauthorized request");
    if (!videoId) throw new apiError(400, "Video ID is missing");

    const videoMongooseId = new mongoose.Types.ObjectId(videoId);
    const existingLike = await Like.findOne({ video: videoMongooseId, createdBy: userId });

    if (existingLike) {
        const updateLike = await Like.findByIdAndUpdate(
            existingLike._id,
            { $set: { isDislike: !existingLike.isDislike } },
            { new: true }
        );
        const message = !updateLike.isDislike ? "Video successfully liked" : "Video successfully unliked";
        return res.status(200).json(new apiResponse(200, { updateLike }, message));
    }

    const newLike = await Like.create({ video: videoMongooseId, createdBy: userId });
    if (!newLike) throw new apiError(500, "Error while liking the video");

    return res.status(200).json(new apiResponse(200, { newLike }, "Video successfully liked"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { tweetId } = req.params;

    if (!userId) throw new apiError(401, "Unauthorized request");
    if (!tweetId) throw new apiError(400, "Tweet ID is missing");

    const tweetMongooseId = new mongoose.Types.ObjectId(tweetId);
    const existingLike = await Like.findOne({ createdBy: userId, tweet: tweetMongooseId });

    if (existingLike) {
        const updateLike = await Like.findByIdAndUpdate(
            existingLike._id,
            { $set: { isDislike: !existingLike.isDislike } },
            { new: true }
        );

        const message = !updateLike.isDislike ? "Tweet successfully liked" : "Tweet successfully disliked";
        return res.status(200).json(new apiResponse(200, { updateLike }, message));
    }

    const newLike = await Like.create({ createdBy: userId, tweet: tweetMongooseId });
    return res.status(200).json(new apiResponse(200, { newLike }, "Tweet successfully liked"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { commentId } = req.params;

    if (!userId) throw new apiError(401, "Unauthorized request");
    if (!commentId) throw new apiError(400, "Comment ID is missing");

    const commentMongooseId = new mongoose.Types.ObjectId(commentId);
    const existingLike = await Like.findOne({ createdBy: userId, comment: commentMongooseId });

    if (existingLike) {
        const updateLike = await Like.findByIdAndUpdate(
            existingLike._id,
            { $set: { isDislike: !existingLike.isDislike } },
            { new: true }
        );

        const message = !updateLike.isDislike ? "Comment successfully liked" : "Comment successfully disliked";
        return res.status(200).json(new apiResponse(200, { updateLike }, message));
    }

    const likeComment = await Like.create({ createdBy: userId, comment: commentMongooseId });
    return res.status(200).json(new apiResponse(200, { likeComment }, "Comment successfully liked"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    if (!userId) throw new apiError(401, "Unauthorized request");

    const likedVideos = [
        // { $match: { createdBy: userId, isDislike: false } },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videoDetails"
            }
        },
        { $unwind: "$videoDetails" }, // Ensures videoDetails is an object, not an array
        {
            $project: {
                _id: 0,
                video: "$videoDetails"
            }
        }
    ];

    const options = { page: parseInt(page), limit: parseInt(limit) };
    const paginate = await Like.aggregatePaginate(Like.aggregate(likedVideos), options);

    if (!paginate.docs.length) throw new apiError(404, "No liked videos found");

    return res.status(200).json(new apiResponse(200, { paginate }, "Successfully fetched liked videos"));
});


export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
};
