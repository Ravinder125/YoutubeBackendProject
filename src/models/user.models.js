import mongoose, { Schema } from "mongoose";
import { apiError } from "../utils/apiError.js"
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
// jwt is bearer token

const userSchema = new Schema({
    // Basic user INFO
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        index: true,
        trim: true,
        minlength: [2, "Username must be at least 2 characters long"],
        maxlength: [20, "Username cannot exceed 20 characters"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        // match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true,
        minlength: [8, "Password must at least 8 characters long"],
        maxlength: [30, "Password cannot exceed 30 characters"],
        // select: false, // Preventing password from being returned in queries by default
    },
    fullName: {
        type: String,
        trim: true,
        required: true,
        // index: true,
    },
    avatar: {
        type: String, // cloudinary url
        required: true
    },
    coverImage: {
        type: String, // cloudinary url
    },
    refreshToken: {
        type: String,
        trim: true,
        // required: true
    },

    // Relationships
    uploadedVideos: [{
        type: Schema.Types.ObjectId,
        ref: 'Video',
    }],
    history: [{
        type: Schema.Types.ObjectId,
        ref: 'Video',
    }],

    // playlist Management
    ownedPlaylists: [{ type: Schema.Types.ObjectId, ref: 'Playlist', default: [] }],
    savedPlaylists: [{ type: Schema.Types.ObjectId, ref: "Playlist", default: [] }],
    watchLater: [{ type: Schema.Types.ObjectId, ref: 'Video', default: [] }],
    likedVideos: [{ type: Schema.Types.ObjectId, ref: 'Video', default: [] }],

}, { timestamps: true })

// Title : hashing password before saving data
// pre is a hook and middelware of mongoose and that's why we are using next as a parameter
// because pre is a hook so we can use this which refers userSchema object
// It executes the code just before saving something in our schema 
// It's better to use regular function instead of arrow function to use "this"
// in pre callback, the function must be async  
userSchema.pre("save", async function (next) {
    // Check if password the password field has been modified
    if (!this.isModified("password")) return next()

    try {
        this.password = await bcrypt.hash(this.password, 10)
        next()

    } catch (error) {
        // Handle any errrors that occur during hashing 
        next(error)
    }
    // if user's Password is not modified then exit(next()) the middelware otherwise hash it 
})

// Creating our own hook or method whatever you call it 
userSchema.methods.isPasswordCorrect = async function (password) {
    // Debugging logs (remove in production)
    console.log("Input password:", password)
    console.log("Strored hashed password", this.password)

    // Check if password and hashed password is missing
    console.log(this)
    if (!password && !this.password) {
        throw new Error("Password or hashed password is missing.");
    }
    const isMatch = await bcrypt.compare(password, this.password);

    return isMatch;
};


const validateEnv = () => {
    if (!process.env.ACCESS_TOKEN_SECRET ||
        !process.env.ACCESS_TOKEN_EXPIRY ||
        !process.env.REFRESH_TOKEN_SECRET ||
        !process.env.REFRESH_TOKEN_EXPIRY
    ) throw new apiError('enviornment variables are missing ')
}

// Generating access token through our custom hook of mongoose
userSchema.methods.generateAccessToken = function () {
    // Always wrap JWT operations in try/catch to handle potential errors

    validateEnv()

    try {
        return jwt.sign(
            {
                _id: this._id,       //  Minimal necessary claims
                email: this.email,   // (Avoid sensitive data like passwords)
                username: this.username,
            },                     //  Omitted fullName unless explicitly needed
            process.env.ACCESS_TOKEN_SECRET, // Ensure this is set in .env
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d", // Fallback to 15min
                //   algorithm: "HS256",  //  Explicitly specify algorithm (security best practice)
            }
        );
    } catch (error) {
        // Handle errors gracefully (e.g., missing secret, invalid options)
        throw new apiError("Failed to generate access token");
    }
};

// Generating access token through our custom hook of mongoose
userSchema.methods.generateRefreshToken = function () {
    validateEnv()
    try {
        return jwt.sign(
            {
                _id: this._id
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRY
            }
        )
    } catch (error) {
        throw new apiError('Refresh token generation failed', error)
    }
}

export const User = mongoose.model('User', userSchema);
