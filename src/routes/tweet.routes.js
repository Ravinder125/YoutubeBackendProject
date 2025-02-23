import { Router } from "express";
import { createTweet } from "../controllers/tweet.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route('/create/tweet').post(verifyJWT, createTweet)


export default router