import { apiError } from "../utils/apiError.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js"
import uploadOnCloudinary from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";


const registerUser = asyncHandler(async (req, res, next) => {
    // logic algorithm:
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


    // fetching details of user from user
    console.log("Body:", req.body, "File", req.file)
    const { fullName, email, username, password } = req.body;

    console.log("Fullname:", fullName, "Email:", email)

    // Checking if user details data containers are empty or not
    if (
        [fullName, email, username, password].some((field) => field?.trim === "")
    ) {
        throw new apiError(400, "All fields are required")
    }

    // Checks if user already exist or not
    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    // console.log(existingUser)

    if (existingUser) {
        throw new apiError(409, "User with email or username already exist")
    }

    // console.log(req.files)
    // console.log(req.body)
    // As mutler attachs file in request 
    // fetching file paths from files object
    console.log(req.file)
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImagePath = req.files?.coverImage[0]?.path;

    // Checks if avatar path is empty
    if (!avatarLocalPath) {
        throw new apiError(400, "Avatar file is required")
    }

    // Uploading files to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImagePath);
    console.log("avatar:", avatar, "coverImage", coverImage)

    if (!avatar) {
        throw new apiError(402, "Avatar file is required")
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

    // Fetching last created user details except Password and refresh token
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // Checking if user successfully created or not
    // if (!createdUser) {
    //     throw new apiError(500, "Error while registering the user")
    // }

    // Sending response to frontend that user is successfully created
    return res.status(201).json(
        new apiResponse(200, createdUser.username, "User is registered successfully")
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
//         res.status(500).json({ message: 'Internal server is error', error: error.message })
//         console.log("Error while login the User:", error.message)
//     }
// })




export { registerUser };