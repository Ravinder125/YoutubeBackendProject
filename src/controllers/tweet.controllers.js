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


export {
    createTweet
}