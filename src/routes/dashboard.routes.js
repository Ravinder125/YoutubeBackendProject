import { Router } from "express";
import { getChannelStats, getChannelVideos } from "../controllers/dashboard.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";


const router = Router();

router.route('/stats').get(verifyJWT, getChannelStats)
router.route('/videos').get(verifyJWT, getChannelVideos )

export default router