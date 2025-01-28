import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

// second approach to connect DB 
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log("Connection Host:", connectionInstance.connection.host);
        // console.log("Connection Ready State:", connectionInstance.connection.readyState);
        // console.log("Connection Port:", connectionInstance.connection.port);
        // console.log("Connection Name:", connectionInstance.connection.name);


        // to lo all the properties and values of connectionInstance object
        // console.dir(connectionInstance, { depth: null, colors: true })
    } catch (error) {
        console.log("MONGODB connection failed", error.message);
        process.exit(1)
    }
}

export default connectDB