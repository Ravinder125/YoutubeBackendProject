import mongoose from "mongoose";
import { Tweet } from "../models/tweet.models.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    if (!userId) throw new apiError(404, "Unautharized request");

    const { content } = req.body;
    if (!content?.trim()) throw new apiError(404, "Content is required")

    const tweet = await Tweet.create({
        content,
        createdBy: userId,
    })

    if (!tweet) throw new apiError(404, "Erorr while creating tweet")

    return res.status(200).json(new apiResponse(200, { tweet }, "Successfully tweet is created"))
})

const updateTweet = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { tweetId } = req.params
    const { content } = req.body;

    if (!userId) throw new apiError(401, "Unauthorized requests");
    if (!tweetId) throw new apiError(401, "Tweet id is missin ");
    if (!content?.trim()) throw new apiError(401, "field cannot be empty");

    const tweetMongooseId = new mongoose.Types.ObjectId(tweetId)
    const updateTweet = await Tweet.findByIdAndUpdate(
        tweetMongooseId,
        { $set: { content: content } },
        { new: true }
    )
    if (!updateTweet) throw new apiError(404, "Tweet not found");

    return res.status(200).json(new apiResponse(200, { updateTweet }, "Tweet is successfully updated"))

})

const deleteTweet = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { tweetId } = req.params;

    if (!userId) throw new apiError(401, "Unauthorized request");
    if (!tweetId) throw new apiError(404, "Tweet id is missing");

    const tweetMongooseId = new mongoose.Types.ObjectId(tweetId)
    const deleteTweet = await Tweet.findByIdAndUpdate(
        tweetMongooseId,
        { $set: { isDelete: true } }
    );

    console.log(deleteTweet)
    if (!deleteTweet) throw new apiError(404, "Tweet not found");

    return res.status(200).json(new apiResponse(200, { deleteTweet }, "Tweet is successfully deleted"))


})



export {
    createTweet,
    updateTweet,
    deleteTweet
}