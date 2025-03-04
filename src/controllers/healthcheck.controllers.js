import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const healthcheck = asyncHandler(async(req, res)=>{
    const userId = req.user?._id;
    console.log(userId)
    if (!userId) throw new apiError(400, "Unauthorized")

    return res.status(200).json( new apiResponse(200,"Everything is alright" ))
})


export {healthcheck}