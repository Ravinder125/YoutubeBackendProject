import dotenv from "dotenv";
import connectDB from "./db/db.js"
import app from "./app.js";
import mongoose from "mongoose";
import { User } from "./models/user.models.js";

dotenv.config({
    path: "./.env"
})

// calling connectDB function to connect Database
connectDB()
    .then(() => {
        console.log("Database is Successfully connected")
        const port = process.env.PORT || 3000
        app.listen(port, () => {
            console.log(`Server is running at port ${port}`)
        })
    })
    .catch((err) => {
        console.log("MONGO db connetion failed", err.message)
    })


// import { Video } from "./models/video.models.js";
// const deleteAllVideos = async () => {
//   try {
//     const result = await Video.deleteMany({}); // Deletes all documents in the collection
//     console.log(`${result.deletedCount} videos deleted successfully.`);
//   } catch (error) {
//     console.error("Error deleting videos:", error);
//   }
// };

// // Call the function
// deleteAllVideos();
























// import mongoose from "mongoose";
// import { DB_NAME } from "./constants.js"
// import express from "express"
// const app = express();


// first approach to connect DB
// ; (async () => {
//     try {
//         const dbConnection = await process.env.MONGODB_URL
//         mongoose.connect(`${dbConnection}/${DB_NAME}`)
//         console.log('db is connected')
//         app.on("error", (error) => {
//             console.log("ERR:", error);
//             throw error
//         })

//         // PORT
//         const port = process.env.PORT || 3000;
//         app.listen(port, () => {
//             console.log(`Server is running at ${port}`)
//         })
//     } catch (error) {
//         console.log("ERROR", error)
//         throw error
//     }
// })()