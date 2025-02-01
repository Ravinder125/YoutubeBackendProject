import { v2 as cloudinary } from "cloudinary";
// import { apiError } from "../utils/apiError.js"
import fs from "fs"

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Uploading file on cloudinary
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            // throw new apiError("Couldn't find the localFilePath")
            console.log("Couldn't find the localpath of file")
        }

        //Upload the file on cloudinary
        const response = cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        console.log("File is uploaded on cloudinary:", response)

        return response;

    } catch (error) {
        console.log('File uploading on cloudinary failed:', error)
        fs.unlinkSync(localFilePath);
    }
}

export default uploadOnCloudinary;