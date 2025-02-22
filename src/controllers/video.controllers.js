import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.models.js"
import { Video } from "../models/video.models.js"
import { apiError } from "../utils/apiError.js"
import mongoose from "mongoose"
import { apiResponse } from "../utils/apiResponse.js"
import { deleteOnCloudinary, uploadOnCloudinary, deleteVideoOnCloudinary } from "../utils/cloudinary.js"
import { cleanUpFiles } from "../utils/cleanUpFiles.js"







const uploadVideo = asyncHandler(async (req, res) => {
    const userId = req.user?._id
    console.log("userId:", userId)

    const videoLocalPath = req.files?.videoFile?.[0]?.path;
    console.log(req.files)
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;
    console.log("videoLocalPath:", videoLocalPath)
    if (!videoLocalPath) {
        throw new apiError(404, "Video is missing");
    };

    const videoCloudinary = await uploadOnCloudinary(videoLocalPath)
    const thumbnailCloudinary = await uploadOnCloudinary(thumbnailLocalPath)
    await cleanUpFiles([videoLocalPath, thumbnailLocalPath])
    console.log(videoCloudinary)
    if (!videoCloudinary?.url) {
        throw new apiError(500, "Error while uploading video");
    };

    const { publish } = req.body;
    const isPublished = (publish === "yes") ? true : false;

    const video = await Video.create({
        videoUrl: videoCloudinary.url,
        createdBy: userId,
        duration: videoCloudinary.duration,
        thumbnail: thumbnailCloudinary?.url || "",
        isPublished

    })

    // Overwriting uploadedVideos:

    // IMP: The current code replaces the entire uploadedVideos array with [video._id]. If you want to append the new video ID instead of replacing the array, you should use $push instead of $set:
    // const owner = await User.findByIdAndUpdate(userId,
    //     {
    //         $push: { uploadedVideos: [video._id] }
    //     },
    //     {
    //         new: true
    //     }
    // )
    return res.status(200)
        .json(
            new apiResponse(200, { Video: video }, "Video is successfully uploaded"))
});

const getOwnVideos = asyncHandler(async (req, res) => {
    const userid = req.user._id
    const videos = await User.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(userid) } },
        {
            $lookup: {
                from: "videos",
                localField: "_id",
                foreignField: "createdBy",
                as: "videos",
                pipeline: [{
                    $addFields: {
                        likesCount: { $size: "$likes" },
                        dislikeCounts: { $size: "$dislikes" },
                        tagsCount: { $size: "$tags" },
                        sharedCount: { $size: "$shared" },
                    }
                }]
            },
        },
        {

            $addFields: {
                videosCount: { $size: "$videos" },
            }
        },
        {
            $project: {
                videos: 1,
                videosCount: 1
            }
        }
    ]);

    console.log(videos)
    if (!videos) {
        throw new apiError(401, "You haven't uploaded any video yet")
    };

    return res.status(200).json(new apiResponse(200, videos, "Videos successfully fetched"))



});

const addVideoToHistory = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const videoId = new mongoose.Types.ObjectId(req.params.videoId);
    if (!videoId) {
        throw new apiError(402, "Video is missing")
    }
    console.log(videoId)

    const watchHistory = await User.findByIdAndUpdate(userId,
        {
            $push: { history: [videoId] }
        },
        { new: true }
    )
    const video = await Video.findById(videoId)
    console.log(video)
    console.log(watchHistory)
    if (!watchHistory) {
        throw new apiError(403, "Error while adding video id in watch history")
    }

    return res.status(201).json(new apiResponse(201, { watchHistory: watchHistory }, "Video successfully added in watch history"))

});

const getAllVideos = asyncHandler(async (req, res) => {

    // const userId = req.user._id;

    const { page = 1, limit = 3, query, sortBy, sorttype, userId } = req.query

    // Create aggregation pipeline
    const aggregateQuery = Video.aggregate([
        {
            $sort: { _id: 1 }
        }
    ]);

    // Pagination options
    const options = { page: 2, limit: 5 };

    // what is paginating it's actually used to devide videos into pages according to pages that's why there's a object called options
    // Paginate using aggregatePaginate
    const paginate = await Video.aggregatePaginate(aggregateQuery, options)

    // Send response
    res.status(200).json(new apiResponse(200, paginate, "Videos successfully fetched"));


});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    console.log(videoId);

    if (!videoId) throw new apiError(400, "video id is required");
    const video = await Video.findById(videoId);

    if (!video) throw new apiError(404, "Video doesn't exist");

    return res.status(200).json(new apiResponse(200, { video: video }, "Video is successfully fetched"));

});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    console.log(videoId);

    if (!videoId) throw new apiError(404, "Video id is missing");

    if (!req.body) throw new apiError(404, "Atleast one field is required")
    const { title, description, status } = req.body;
    console.log(req.file)
    const thumbnailLocalPath = req.file?.path

    const thumbnail = thumbnailLocalPath ? await uploadOnCloudinary(thumbnailLocalPath) : ""
    await cleanUpFiles([thumbnailLocalPath])

    console.log(thumbnail)
    const updatedVideo = await Video.findByIdAndUpdate(new mongoose.Types.ObjectId(videoId), {
        $set: { title, description, thumbnail: thumbnail.url, status },
        // $push: {
        //     likes: likes ? [likes] : [],
        //     dislike: dislikes ? [dislikes] : [],
        //     tags: tags ? [tags] : [],
        //     shared: shared ? [shared] : [],
        // },
    },
        { new: true }
    )

    console.log(updatedVideo)

    res.status(200).json(new apiResponse(200, { updateVideo: updatedVideo }, "Video successfully updated"))



});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    const video = await Video.findById(videoId)
    console.log(video);
    if (!video) throw new apiError(404, "Video doesn't exist");

    // const isDeletedOnCloudinary = await deleteOnCloudinary(video.videoUrl)
    const isDeletedOnCloudinary = await deleteVideoOnCloudinary(video.videoUrl)
    const isVideoRemoved = await Video.findByIdAndDelete(video._id);

    return res.status(200).json(new apiResponse(200, { isVideoRemoved: isVideoRemoved }, "Video is successfully deleted"))
})

const toggleVideoPublish = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    console.log(videoId);

    const { publish } = req.body;
    console.log(publish);
    if (!publish) throw new apiError(404, "Field is required");

    const isPublished = (publish === "yes") ? true : false;

    const video = await Video.findById(videoId);

    if (!video?.isPublished) {
        video.isPublished = true
    } else {
        video.isPublished = false
    }

    await video.save({ validateBeforeSave: false })

    return res.status(200).json(new apiResponse(200, { video: video }, "Video's publish status is succesfully updated"))

})
export {
    getVideoById,
    updateVideo,
    addVideoToHistory,
    getOwnVideos,
    uploadVideo,
    getAllVideos,
    deleteVideo,
    toggleVideoPublish
}