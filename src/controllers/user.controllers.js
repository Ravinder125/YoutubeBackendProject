import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
import { cleanUpFiles } from "../utils/cleanUpFiles.js";
import jwt from "jsonwebtoken"
import { json } from "express";

const generateRefreshAndAccessToken = async (userId) => {
    try {
        // Get user by user id
        const user = await User.findById(userId);

        // generate token by calling custom methods
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // save refreshToken and save all the progress
        user.refreshToken = refreshToken;
        user.save({ validateBeforeSave: false });

        // return tokens for further procceed
        return { accessToken, refreshToken }

    } catch (error) {
        throw new apiError(500, 'Error while generating refresh tand access tokens')
    }
}


const registerUser = asyncHandler(async (req, res) => {
    // logic algorithm of fetching data from user, createing a new user and uploading files on cloudinary :-
    // get user details from frontend 
    // validation - not empy 
    // check if user already exists : by email and username
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // check if they are successfully uploaded or not
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // retrun res

    console.log("Request Body:", req.body, "Files:", req.files);

    // Validate request body
    if (!req.body || Object.keys(req.body).length === 0) {
        throw new apiError(400, "Request body is empty");
    }

    const { fullName, email, username, password } = req.body;

    // Validate required fields
    if (![fullName, email, username, password].every(field => field?.trim())) {
        throw new apiError(400, "All fields are required");
    }

    // Validate file uploads
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    if (!avatarLocalPath) {
        throw new apiError(400, "Avatar file is required");
    }

    const coverImagePath = req.files?.coverImage?.[0]?.path || null;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
        await cleanUpFiles([avatarLocalPath, coverImagePath]);
        throw new apiError(409, "User with email or username already exists");
    }

    // Upload files to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    console.log("avatar:", avatar)
    const coverImage = coverImagePath ? await uploadOnCloudinary(coverImagePath) : null;
    if (!avatar?.url) {
        await cleanUpFiles([avatarLocalPath, coverImagePath]);
        throw new apiError(500, "Failed to upload avatar to Cloudinary");
    }
    await cleanUpFiles([avatarLocalPath, coverImagePath]);


    // Create user in the database
    const user = await User.create({
        fullName,
        email,
        username,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || ""
    });

    // Fetch the created user without password and refresh token
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) {
        throw new apiError(500, "Error while registering the user");
    }

    // Respond with success
    return res.status(201).json(new apiResponse(201, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
    // Login logic algorithm
    // fist extract user info from user (req.body)
    // then check if the body is empty?
    // then check if user exist or not if exist then create his new access token by email or username
    // then send respond "You are logined"

    // by Hitesh Chaudhary sir ji
    // req body -> data
    // username or email -> find the user
    // password check
    // access and refresh token generate
    // send them in cooki

    // taking json format data currently from Postman
    console.log(req.body)
    const { email, username, password } = req.body;
    console.log(email, password)

    // Checks if body is empty
    if (!(email || username)) {
        throw new apiError(400, "username or email is required");
    }
    if (!password) {
        throw new apiError(400, "Password is required")
    }

    // checks if user exist or not 
    const user = await User.findOne({
        $or: [{ username }, { email }]
    }
    )


    if (!user) {
        throw new apiError(404, "User doesn't exists")
    }

    // Checks password
    // IMPORTANT:// You can't find your created methods in "User" object because it's related to mongoose but it doesn't contains your methods.
    // then who contains the methods, the answer this "user" variable right now
    const IsPasswordValid = await user.isPasswordCorrect(password);

    if (!IsPasswordValid) {
        throw new apiError(401, "Invalid user credentials")
    }

    const { accessToken, refreshToken } = await generateRefreshAndAccessToken(user._id)

    // for now the user variable which contains user model but it's refresh token is empty because user model is updated but not the variable
    // As we are gonna send user it's details but the password and refresh token
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    // const safeUser = loggedInUser.toObject()

    // we have to set options for cokiee because cokiee can be modified by frontend side so it's for security.
    const options = {
        httpOnly: true,
        secure: true
        // now cokiee are now modifiable by server but can be seen
    }
    console.log("user", loggedInUser)
    // so that's how tokens in cookie format in user browser
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new apiResponse(
                200,
                {
                    loggedInUser, accessToken, refreshToken
                },
                "User logged in Successfully"
            )
        )


})

const logoutUser = asyncHandler(async (req, res) => {

    // clears refresh token and of user by user id through req.user (which was created by our custom middleware)
    // and insert new field to user Schema 
    // set Authorization and Bearer in logout headers in postman
    const user = await User.findByIdAndUpdate(req.user._id,
        {
            $set: { refreshToken: undefined }
        },
        { new: true }

    )

    // As we know to we use options to securely talk with cookies
    const options = {
        httpOnly: true,
        secure: true
    }

    // clearing cookies from user browser As they logout
    return res
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new apiResponse(200, {}, "User logged out")
        )



})

const refreshAccesToken = asyncHandler(async (req, res) => {
    try {
        // IMP - Why do we actually a refreshAccesToken controller the answer is obvious as we know accessToken has a expiry date if it expires then how can he access their stuffs from us(server) because if he doesn't have access token then we can just say that we don't them for temporary and why temporary, because the user still has refresh token, otherwise they have to login again
        const IncomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken
        console.log(IncomingRefreshToken)
        if (!IncomingRefreshToken) {
            throw new apiError(401, "Anuathrized request")
        }

        const decodedToken = jwt.verify(IncomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).select("-password")

        if (!user) {
            throw new apiError(404, "Invalid refresh token ")
        }
        console.log("userToken:", user.refreshToken,
            "IncomingRefreshToken", IncomingRefreshToken
        )
        if (IncomingRefreshToken !== user?.refreshToken) {
            throw new apiError(404, "Refresh token is expired or used")
        }
        const { accessToken, refreshToken } = await generateRefreshAndAccessToken(user._id)

        const options = {
            httpOnly: true,
            secure: true
        }
        res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new apiResponse(
                    200,
                    {
                        accessToken, refreshToken
                    },
                    "Access token refresh"
                )
            )


    } catch (error) {
        throw new apiError(401, error?.message || "Invalid refresh token")
    }


})

const changePassword = asyncHandler(async (req, res) => {

    // Get userId from verifyJWT controller
    const userId = req.user?._id
    const user = await User.findById(userId)
    // console.log(user)

    // Get user inputs 
    const { oldPassword, newPassword, confirmPassword } = req.body
    // console.log(oldPassword, confirmPassword, newPassword)

    // Valid required fields
    if (
        !oldPassword?.trim() ||
        !newPassword?.trim() ||
        !confirmPassword?.trim()
    ) {
        throw new apiError(400, "All fields are required")
    }

    // Check if new password match
    if (newPassword !== confirmPassword) {
        throw new apiError(400, "New and confirmation password don't match")
    }

    // Verify old password
    const isPasswordValid = await user.isPasswordCorrect(oldPassword)
    if (!isPasswordValid) {
        throw new apiError(401, "Invalid old password")
    }

    // Update password
    // user.password = confirmPassword;
    // user.save();

    //    IMP // select won't work on user variable because select work on User
    // const newPassUser = user?.select('-password -refreshToken')

    // or otherway of changing password
    const userInfo = await User.findByIdAndUpdate(userId,
        {
            $set: { password: confirmPassword },
        },
        { new: true }
    ).select('-password -refreshToken')


    return res.status(200).json(
        new apiResponse(
            200,
            { user: userInfo },
            "Password changed successfully")
    )


})

const updateAvatar = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    const avatarLocalPath = req.file?.path
    console.log("Request file:", req.file)
    console.log("avatarLocalPath:", avatarLocalPath)
    if (!avatarLocalPath) {
        throw new apiError(400, "Avatar file is required")
    }
    const avatarCloudinaryPath = await User.findById(userId).select("-password -refreshToken")
    console.log("avatarCloudinaryPath", avatarCloudinaryPath.avatar)
    const deleteFile = avatarCloudinaryPath ? await deleteOnCloudinary(avatarCloudinaryPath.avatar) :
        console.log(deleteFile)
    if (!deleteFile) {
        await cleanUpFiles([avatarLocalPath])
        throw new apiError(502, "Error while deleting file from cloudinary")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    await cleanUpFiles([avatarLocalPath])

    const user = User.findById(userId)

    user.avatar = avatar?.url
    user.save
    res.status(200).json(200, { avatarUrl: avatar?.url }, "Avatar file is updated")
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccesToken,
    changePassword,
    updateAvatar
};
