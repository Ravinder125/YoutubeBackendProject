import { Router } from "express";
import { createTweet, deleteTweet, updateTweet } from "../controllers/tweet.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route('/create/tweet').post(verifyJWT, createTweet)
router
    .route('/tweet/u/:tweetId')
    .patch(verifyJWT, updateTweet)
    .delete(verifyJWT, deleteTweet)


export default router