import mongoose from "mongoose";
import { Playlist } from "../models/playlist.models.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    if (!userId) throw new apiError(404, "User id is missing");

    const { name, description, isPublic } = req.body
    const { videoId } = req.params

    const playlist = await Playlist.create({
        name: name?.trim() || "",
        description: description?.trim() || "",
        isPublic: (isPublic?.toLowerCase() === "yes") ? true : false,
        createdBy: userId,
        // videos: videoId ? [new mongoose.Types.ObjectId(videoId)] : []
    })
    console.log(playlist)

    if (!playlist) throw new apiError(500, "Error while creating new plalist")

    return res.status(201).json(new apiResponse(201, { playlist }, "Playlist is successfully created"))
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const { videoId, playlistId } = req.params;
    console.log("videoId:", videoId)
    console.log("playlistId:", playlistId)
    console.log("userId:", userId)
    if (!userId) throw new apiError(404, "User id is missing")
    if (!videoId) throw new apiError(404, "Video id is missing");
    if (!playlistId) throw new apiError(404, "Playlist id is missing")

    const videoMongooseId = new mongoose.Types.ObjectId(videoId)
    const playlistMongooseId = new mongoose.Types.ObjectId(playlistId)

    const checkIfAlreadyExist = await Playlist.findOne({
        _id: playlistMongooseId,
        videos: { $in: [videoMongooseId] }
    })

    console.log(checkIfAlreadyExist)
    if (checkIfAlreadyExist) throw new apiError(400, "Video already exist in the playlist")

    const playlist = await Playlist.findByIdAndUpdate(
        playlistMongooseId,
        { $push: { videos: [videoMongooseId] } },
        { new: true }
    )

    if (!playlist) throw new apiError(500, "Error while adding video to playlist")

    return res.status(200).json(new apiResponse(200, { playlist }, "Video successfully added to playlist"))
});

const getPLaylistById = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { playlistId } = req.params;

    if (!userId) throw new apiError(400, "User id is missing")
    if (playlistId.toString() === "playlistId") throw new apiError(404, "Playlist id is missing");

    const playlist = await Playlist.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(playlistId) }
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videoList",
                pipeline: [
                    {
                        $project: {
                            title: 1,
                            views: 1,
                            thumbnail: 1,
                            createdAt: 1,
                            duration: 1,
                            createdBy: 1 // Include createdBy for the nested lookup
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "createdBy",
                            foreignField: "_id",
                            as: "createdByUser",
                            pipeline: [
                                {
                                    $project: {
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            createdBy: { $arrayElemAt: ["$createdByUser", 0] }
                        }
                    },
                    {
                        $project: {
                            createdByUser: 0 // Remove the createdByUser array after extracting the username
                        }
                    }
                ]
            }
        }
    ]);

    if (!playlist) throw new apiError(500, "Error while fetching the playlist");

    return res.status(200).json(new apiResponse(200, { playlist }, "Playlist fetched successfully"));

});

const deleteVideoPlaylist = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { videoId, playlistId } = req.params;

    if (!videoId || !playlistId) {
        throw new apiError("Both videoId and playlistId are required", 400);
    }

    // Find the playlist and remove the video from it
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        new mongoose.Types.ObjectId(playlistId),
        { $pull: { videos: new mongoose.Types.ObjectId(videoId) } },
        { new: true } // Return the updated document
    );

    if (!updatedPlaylist) {
        throw new apiError("Playlist not found", 404);
    }

    return res
        .status(200)
        .json(new apiResponse(200, { updatedPlaylist }, "Video successfully deleted from the playlist"))

});


export {
    createPlaylist,
    addVideoToPlaylist,
    getPLaylistById,
    deleteVideoPlaylist
}

