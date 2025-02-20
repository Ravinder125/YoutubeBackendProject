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
        console.log("Deleting file from Cloudinary with URL:", url);

        // Extract the public ID from the URL
        const publicId = extractPublicId(url);
        console.log("Extracted Public ID:", publicId);

        // Delete the file from Cloudinary
        const result = await cloudinary.uploader.destroy(publicId);

        // Check if the deletion was successful
        if (result.result !== "ok") {
            throw new Error(`Failed to delete file: ${result.result}`);
        }

        console.log('File deleted successfully:', result);
        return result.result
    } catch (error) {
        console.error('Error deleting file:', error);
        throw error; // Re-throw the error if you want to handle it elsewhere
    }
};

const deleteVideoOnCloudinary = async (url) => {
    const publicId = extractPublicId(url);

    cloudinary.api
        .delete_resources(['e6sdugyzv9n71xd7r3fs'],
            { type: 'upload', resource_type: 'video' })
        .then(console.log("Video is successfully deleted")).catch((error) => console.log("Error", error))
}

export { uploadOnCloudinary, deleteOnCloudinary, deleteVideoOnCloudinary };