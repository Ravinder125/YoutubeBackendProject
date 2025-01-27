import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

// second approach to connect DB 
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.name}`)

        // to lo all the properties and values of connectionInstance object
        // console.dir(connectionInstance, { depth: null, colors: true })
    } catch (error) {
        console.log("MONGODB connection error", error);
        process.exit(1)
    }
}

export default connectDB