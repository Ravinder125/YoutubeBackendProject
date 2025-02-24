
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription, } from "../controllers/subscription.controllers.js";

const router = Router();

router
    .route("/subscriber/:channelId")
    .get(verifyJWT, getSubscribedChannels)
    .patch(verifyJWT, toggleSubscription)

router.route("/channel/:subscriberId").get(verifyJWT, getUserChannelSubscribers)
export default router