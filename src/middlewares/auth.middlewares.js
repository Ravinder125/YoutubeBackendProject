import { User } from "../models/user.models.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // Get access token from cookies or header
        const token = req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "")

            // Checks token 
        if (!token) {
            throw new apiError(401, "Unautharized request ")
        }

        // Decode token to get payload of user 
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        // Find user by id
        const user = await User.findById(decodedToken._id).select("-password -refreshToken")

        if (!user) {
            throw new apiError(401, "Invalid Access Token")
        }

        // creating req.user Object with user 
        req.user = user;
        next()

    } catch (error) {
        throw new apiError(401, error?.message || "Invalid access token")
    }

})