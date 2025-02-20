
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { toggleSubscription } from "../controllers/subscription.controllers.js";

const router = Router();

// router.use(verifyJWT) // Apply verifyJWT middleware to all routes in this file 


router
    .route("/c/:channelId")
    //     .get(verifyJWT, getSubscribedChannels)
    .post(verifyJWT, toggleSubscription)

export default router