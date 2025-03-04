import { asyncHandler } from  "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js"
import { apiResponse } from "../utils/apiResponse.js"
import { User } from "../models/user.models.js"
import { Video } from "../models/video.models.js"
import mongoose from "mongoose";



const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscriber, total videos, toatl likes etc.

    const userId = req.user?._id;
    if (!userId) throw new apiError(401, "Unauthorized");


const aggregateQuery = await User.aggregate([
    {
        $match: { _id: userId}
    },
    {
        $lookup: {
            from: "videos",
            localField: "_id",
            foreignField: "createdBy",
            as: "channelVideos",
            pipeline: [
                { $addFields: { viewCount: { $size: "$views" } } },
                {
                    $project: {
                        thumbnail: 1,
                        title: 1,
                        viewCount: 1,
                        description: 1,
                        duration: 1,
                        createdAt: 1
                    }
                }
            ]
        }
    },
    {
        $lookup: {
            from: "subscriptions",
            localField: "_id",
            foreignField: "channel",
            as: "channelSubscribers"
        }
    },
    {
        $addFields: {
            subscriberCounts: { $size: "$channelSubscribers" },
            totalViews: { $sum: "$channelVideos.viewCount"} // Adding all video views
        }
    },
    {
        $project: {
            channelVideos: 1,
            totalViews: 1,
            avatar: 1,
            username: 1,
            email: 1,
            coverImage: 1,
            subscriberCounts: 1
        }
    }
]);

    return res.status(200).json( new apiResponse(200, { aggregateQuery }, "Successfully channels stats fetched"))
    
})

const getChannelVideos = asyncHandler(async (req, res) => {
    const { page =  1, limit = 2 } = req.query
    const userId = req.user._id;
    if (!userId) throw new apiError(401, "Unauthorized request");

    const aggregateQuery = ([
        {
            $match: { createdBy: userId, isDelete: false }
        },
       
        {
            $addFields: { viewsCount: { $size: "$views" } },
        },
    ])

    const options = { page: parseInt(page), limit: parseInt(limit)}
    const channelVideos = await Video.aggregatePaginate(Video.aggregate(aggregateQuery), options)

    if (!channelVideos) throw new apiError(404, "Channel videos not found")
    
    return res.status(200).json(new apiResponse(200, { channelVideos }, "Channel videos successfully fetched"))
    
    
})


export {
    getChannelStats,
    getChannelVideos
}