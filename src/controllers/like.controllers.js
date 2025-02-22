import mongoose from "mongoose";
import { Like } from "../models/like.models.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";


const toggleVideoLIke = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { videoId } = req.params;

    if (!userId) throw new apiError(401, "Unauthorized request");
    if (!videoId) throw new apiError(400, "Video ID is missing");

    const videoMongooseId = new mongoose.Types.ObjectId(videoId);
    const existingLike = await Like.findOne({
        video: videoMongooseId,
        createdBy: userId
    });

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        return res.status(200).json(new apiResponse(200, "Video successfully unliked"))
    }
    const newLike = await Like.create({
        video: videoMongooseId,
        createdBy: userId,
    });

    if (!newLike) throw new apiError(500, "Error while liking or unliking the video");

    return res.status(200).json(new apiResponse(200, { newLike }, "Video successfully liked"));
});

const toggleTweetLIke = asyncHandler(async (req, res) => {

})
const toggleCommentLIke = asyncHandler(async (req, res) => {

})

const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user._id
    if (!userId) throw new apiError(404, "Unauthrized request");

    console.log(userId)

    // const getLikedVideos = await Like.find({ createdBy: userId })
    const getLikedVideos = await Like.aggregate([
        {
            $match: { createdBy: userId }
        },
        {
            $lookup: {
                from: "videos", // Assuming you have a videos collection
                localField: "video",
                foreignField: "_id",
                as: "videoDetails"
            }
        },
        {
            $unwind: "$videoDetails" // converting array into object 
        },
        {
            $project: {
                _id: 0,
                video: "$videoDetails"
            }
        }
    ]);

    if (!getLikedVideos.length) throw new apiError(404, "Liked videos not found");
    console.log(getLikedVideos);

    return res.status(200).json(new apiResponse(200, { getLikedVideos }, "Successfull fetched liked videos"))
})

export {
    toggleVideoLIke,
    toggleTweetLIke,
    toggleCommentLIke,
    getLikedVideos
}