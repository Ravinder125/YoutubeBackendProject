
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription, } from "../controllers/subscription.controllers.js";

const router = Router();

router
    .route("/c/:channelId")
    .post(verifyJWT, getSubscribedChannels)
    .patch(verifyJWT, toggleSubscription)

router.route("/u/:subscriberId").get(verifyJWT, getUserChannelSubscribers)
export default router