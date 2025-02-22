import mongoose from "mongoose";
import { Playlist } from "../models/playlist.models.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ObjectId } from "bson"

const createPlaylist = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    if (!userId) throw new apiError(400, "Unautharized request");

    const { name, description, isPublic } = req.body

    const playlist = await Playlist.create({
        name: name?.trim() || "",
        description: description?.trim() || "",
        isPublic: (isPublic?.toLowerCase() === "yes") ? true : false,
        createdBy: userId,
    })
    console.log(playlist)

    if (!playlist) throw new apiError(500, "Error while creating new plalist")

    return res
        .status(201)
        .json(new apiResponse(201, { playlist }, "Playlist is successfully created"))
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const { videoId, playlistId } = req.params;

    if (!userId) throw new apiError(400, "Unautharized request");
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

    return res
        .status(200)
        .json(new apiResponse(200, { playlist }, "Video successfully added to playlist"))
});

const getPlaylistById = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { playlistId } = req.params;

    if (!userId) throw new apiError(400, "Unautharized request");
    if (playlistId.toString() === "playlistId") throw new apiError(404, "Playlist id is missing");

    const playlist = await Playlist.aggregate([
        {
            $match: { _id: new ObjectId(playlistId) }
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

    return res
        .status(200)
        .json(new apiResponse(200, { playlist }, "Playlist fetched successfully"));

});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { videoId, playlistId } = req.params;

    if (!userId) throw new apiError(400, "Unautharized request");
    if (!videoId || !playlistId) {
        throw new apiError("Both videoId and playlistId are required", 400);
    }

    // Find the playlist and remove the video from it
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        new ObjectId(playlistId),
        { $pull: { videos: new ObjectId(videoId) } },
        { new: true } // Return the updated document
    );

    if (!updatedPlaylist) {
        throw new apiError("Playlist not found", 404);
    }

    return res
        .status(200)
        .json(new apiResponse(200, { updatedPlaylist }, "Video successfully deleted from the playlist"))

});

const deletePlaylist = asyncHandler(async (req, res) => {

    const userId = req.user._id;
    if (!userId) throw new apiError(400, "Unauthorized request");

    const { playlistId } = req.params;
    console.log('Playlist ID:', playlistId); // Debugging: Log the playlistId

    // Validate playlistId
    if (!playlistId) {
        throw new apiError(404, "Invalid or missing playlist ID");
    }

    // Create ObjectId
    const playlistMongooseId = new ObjectId(playlistId);

    // Delete the playlist
    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistMongooseId);
    console.log('Deleted Playlist:', deletedPlaylist); // Debugging: Log the result

    if (!deletedPlaylist) {
        throw new apiError(404, "Playlist not found");
    }

    // Send response
    return res
        .status(200)
        .json(new apiResponse(200, { deletedPlaylist }, "Playlist successfully deleted"));


})

const updatePlaylist = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { playlistId } = req.params;
    const { name, description, isPublic } = req.body;

    if (!userId) throw new apiError(400, "Unautharized request");
    if (
        !name?.trim() &&
        !description?.trim() &&
        !isPublic?.trim()) {
        throw new apiError(404, "At least one field is required");
    }

    if (!playlistId) throw new apiError(404, "Playlist id is missing")

    const playlistMongooseId = new mongoose.Types.ObjectId(playlistId)
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistMongooseId,
        {
            $set: {
                name: name?.trim() || "",
                description: description?.trim() || "",
                isPublic: (isPublic.toLowerCase() === "yes") ? true : false
            }
        },
        { new: true }
    )



    return res
        .status(200)
        .json(new apiResponse(200, { updatedPlaylist }, "Playlist is successfully updated"))

})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const userId = req.user._id
    if (!userId) throw new apiError(400, "Unauthorized request");

    const playlists = await Playlist.find({ createdBy: userId }, { name: 1, description: 1, isPublic: 1 });
    console.log(playlists)
    if (!playlists) throw new apiError(404, "Playlists not found");

    return res
        .status(200)
        .json(new apiResponse(200, playlists, "User playlists successfully fetched"))

})

export {
    createPlaylist,
    addVideoToPlaylist,
    getPlaylistById,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist,
    getUserPlaylists
}

