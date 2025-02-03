import { apiError } from "../utils/apiError.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js"
import uploadOnCloudinary from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
import fs from "fs"


const registerUser = asyncHandler(async (req, res, next) => {
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


    // Get details from the User
    // console.log("Body:", req.body, "Files", req.files)
    if (req.body.length <= 0) {
        throw new apiError(400, "body is empty");
    }
    const { fullName, email, username, password } = req.body

    // console.log("Fullname:", fullName, "Email:", email)

    // Checks if user details containers are empty or not
    if (
        [fullName, email, username, password].some((field) =>
            field?.trim() === "" || false
        )
    ) {
        throw new apiError(400, "All fields are required")
    }


    // Get images file paths from req.files ( imp- req.file will be used for single file upload)
    // const coverImagePath = req.files?.coverImage[0]?.path;
    // A classic way to do just like above
    let coverImagePath
    if (req.files && Array.isArray(req.files.coverImage)
        && req.files.coverImage.length > 0) {
        return coverImagePath = req.files.coverImage[0].path
    }
    let avatarLocalPath;
    try {
        avatarLocalPath = req.files?.avatar[0]?.path;
    } catch (error) {
        throw new apiError(400, "Avatar file is required")

    }
    // Checks if user already exist or not
    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    // console.log(existingUser)

    if (existingUser) {
        // If user exist then delete files from local and throw throw error
        const clearExistUserFiles = (async () => {
            await fs.unlinkSync(avatarLocalPath);
            if (coverImagePath) await fs.unlinkSync(coverImagePath)
            console.log("Uploaded files by Existing user have been removed from the system ")
        })()
        throw new apiError(409, "User with email or username already exist")
    }


    // Uploading files to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImagePath)
    console.log("avatar:", avatar, "coverImage", coverImage)

    if (!avatar) {
        throw new apiError(402, "Avatar file from cloudinary is empty ")
    }

    // Creating user after all passess and stroing into user variable
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        email,
        coverImage: coverImage?.url || "",
        username,
        password

    })

    // Get last created user details without Password and refresh token
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // Checks if user successfully created or not
    if (!createdUser) {
        throw new apiError(500, "Error while registering the user")
    }

    // Sending response to frontend that user is successfully created
    return res.status(201).json(
        new apiResponse(200, createdUser, "User is registered successfully")
    )

})





// Just Practice bro
// We have created register controller here to register user now use it in user router
// const registerUser = asyncHandler(async (req, res, next) => {
//     try {
//         console.log(req.body)
//         const { username, password } = req.body;

//         if (!username || !password) return res.status(401).json({ message: "username and password is required" })
//         console.log(username, password)

//         res.status(2001).json({ message: "User registered successfully" })

//     } catch (error) {
//         res.status(401).json({ message: "data not found" }, error.message)
//         console.log("Error while registering the User", error)
//     }

// })

// const loginUser = asyncHandler(async (req, res, next) => {
//     try {
//         const { username, password } = req.body;

//         // if username and password are empy then response with the message of "Invalid Credentials"
//         if (!username || !password) return res.status('402').json({ message: "username and password is required" })

//         if (username === "Ravinder" && password === "Ravinder123") {
//             res.status(200).json({ message: "User logged in successfully" })

//         }
//     } catch (error) {
//         res.status(500).json({ message: 'Internal server error', error: error.message })
//         console.log("Error while login the User:", error.message)
//     }
// })




export { registerUser };