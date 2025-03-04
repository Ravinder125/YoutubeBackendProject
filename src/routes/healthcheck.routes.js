import { Router } from "express";
import {healthcheck} from "../controllers/healthcheck.controllers.js"
import {verifyJWT} from "../middlewares/auth.middlewares.js"
const router = Router();

router.route('/').get(verifyJWT, healthcheck)


export default router