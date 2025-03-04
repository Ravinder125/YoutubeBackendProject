import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { Subscription } from "../models/subscription.models.js";
import { apiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const userId = req.user._id
    console.log(channelId)
    console.log(userId)

    if (!channelId) throw new apiError(404, "Channel id is missing");


    if (channelId.toString() === userId.toString()) throw new apiError(400, "You can't subscribe yourself")

    const channelMongooseId = new mongoose.Types.ObjectId(channelId)

    const subscription = await Subscription.findOne({ $and: [{ channel: channelMongooseId }, { subscriber: userId }] })
    console.log(subscription)

    let toggle, message
    if (subscription) {
        toggle = await Subscription.findByIdAndDelete(subscription._id)
        message = "Channel is successfully unsubscribed"
    } else {
        toggle = await Subscription.create({
            subscriber: userId,
            channel: channelMongooseId
        })
        message = "Channel is successfully subscribed"
    }

    console.log(toggle)
    return res.status(200).json(new apiResponse(200, { toggle }, message))

})

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const userId = req.user?._id; // Safe access
    console.log("User Id:", userId);

    if (!userId) {
        throw new apiError(401, "Unauthorized: User ID is missing");
    }

    // Fetch channels the user has subscribed to
    const subscribedChannels = await Subscription.find({ subscriber: userId }).populate("channel");
    console.log(subscribedChannels)

    return res.status(200).json(new apiResponse(200, { subscribedChannels }, "Subscribed channels successfully fetched"));
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {subscriberId} = req.params;
    const userId = req.user._id

    const subscribers = await Subscription.aggregate([
        {
            $match: { channel: userId }
        },
        {
            $lookup: {
                from: "users",
                foreignField: "_id",
                localField: "subscriber",
                as: "subscriberInfo",
                pipeline: [{
                    $project: {
                        username: 1,
                        avatar: 1,
                        email: 1
                    }
                }]
            }
        },
        {
            $addFields: {
                subscriberCount: { $sum: 1 },
            }
        }
    ]);

    if (!subscribers?.length) throw new apiError(403, "Error while fetching subscribers");

    return res.status(200).json(new apiResponse(200, { subscribers }, "User channel's subscribers successfully fetched"))

})

export {
    toggleSubscription,
    getSubscribedChannels,
    getUserChannelSubscribers
}