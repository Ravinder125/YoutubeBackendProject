import { apiError } from "../utils/apiError";
import { apiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const createTweet = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    if (!userId) throw new apiError(404, "Unautharized request");
    
})