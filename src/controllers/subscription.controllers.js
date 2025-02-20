import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { Subscription } from "../models/subscription.models.js";
import { apiResponse } from "../utils/apiResponse.js";


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!channelId) throw new apiError(404, "Channel id is missing");

    const { userId } = req.user._id

    const subscription = await Subscription.findOne({ $or: [channelId, userId] })
    if (subscription) {
        var unsubscribe = await Subscription.findByIdAndDelete(subscription)
    } else {
        var subscribe = await Subscription.create({
            subscriber: userId,
            channel: channelId
        })
    }

    const successMessage = unsubscribe ? "Channel is successfully unsubscribed" : "Channel is successfully subscribed"
    return res.status(200).json(new apiResponse(200, { Subscription: unsubscribe || subscribe }, successMessage))

})



export {
    toggleSubscription
}