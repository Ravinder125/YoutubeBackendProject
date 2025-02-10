import { v2 as cloudinary } from "cloudinary";
import { apiError } from "./apiError.js";


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
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // fs.unlinkSync(localFilePath)
        console.dir("File is uploaded on cloudinary:", response.inspect)

        return response;

    } catch (error) {
        console.log('File uploading on cloudinary failed:', error)
    }
}

// Function to extract public ID from URL
const extractPublicId = (url) => {
    const parts = url.split('/upload/');
    if (parts.length > 1) {
        const publicIdWithVersion = parts[1].split('/').pop(); // Get the last part after '/upload/'
        const publicId = publicIdWithVersion.split('.')[0]; // Remove file extension if present
        console.log(publicId)
        return publicId;
    }
    return null;
};

const deleteOnCloudinary = async (url) => {
    try {
        console.log(url)
        const publicId = extractPublicId(url)
        console.log(publicId)
        if (!result.result.okay) {
            throw new apiError(402, "File doesn't exist", result)
        }
        const result = await cloudinary.uploader.destroy(publicId);
        console.log('File deleted successfully:', result);
    } catch (error) {
        console.error('Error deleting file:', error);
    }


}

export { uploadOnCloudinary, deleteOnCloudinary };