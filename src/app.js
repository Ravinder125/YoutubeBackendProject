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


// Import routes
import userRouter from "./routes/user.routes.js"
import videoRouter from "./routes/video.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import likeRouter from "./routes/like.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import commentRouter from "./routes/commen.routes.js"
// Routes declaration
// As we are importing routes we have to use "app.use" middleware
// Every user router will be handled here
// URI = http://localhost:4000/api/v1/users/register
app.use('/api/v1/users', userRouter)
app.use('/api/v1/videos', videoRouter)
app.use('/api/v1/subscriptions', subscriptionRouter)
app.use('/api/v1/playlists', playlistRouter)
app.use('/api/v1/likes', likeRouter)
app.use('/api/v1/tweets', tweetRouter)
app.use('/api/v1/comments', commentRouter)







export default app;