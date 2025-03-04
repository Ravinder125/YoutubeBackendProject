import { Router } from "express";
import { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";


const router = Router();

router.route('/toggle/v/:videoId').post(verifyJWT, toggleVideoLike)
router.route('/toggle/t/:tweetId').post(verifyJWT, toggleTweetLike)
router.route('/toggle/c/:commentId').post(verifyJWT, toggleCommentLike)
router.route('/videos').get(verifyJWT, getLikedVideos)

// This is so much import to know that making routes in a right way is very essential other wise it' will work weirdly and it's so frustrating brahh


export default router