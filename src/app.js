import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// cookieParser is used to access and set cookie from our server to user browser 
// create And Upadate cookie

const app = express();

// setting up who can talk to backend
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    Credential: true
}))

// setting up IN what form data will be fetched from frontend and also a limite of data
app.use(express.json({ limit: "20kb", }));

// here also can be set limit
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());




export default app;