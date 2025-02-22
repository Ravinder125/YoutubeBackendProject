import { Router } from "express";
import { getLikedVideos, toggleVideoLIke } from "../controllers/like.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";


const router = Router();

router.route('/like/:videoId').post(verifyJWT, toggleVideoLIke)
router.route('/like/videos').get(verifyJWT, getLikedVideos)


export default router