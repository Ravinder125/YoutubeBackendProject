import { Router } from "express";
import { createTweet, deleteTweet, updateTweet, getUserTweets } from "../controllers/tweet.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route('/').post(verifyJWT, createTweet)
router
    .route('/:tweetId')
    .patch(verifyJWT, updateTweet)
    .delete(verifyJWT, deleteTweet)
router.route('/user/:userId').get(verifyJWT, getUserTweets)

export default router