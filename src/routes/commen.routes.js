import { Router } from "express";
import { createComment, deleteComment, getVideoComments, updateComment } from "../controllers/comment.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router()

router.route('/create/c/:videoId').post(verifyJWT, createComment)
router.route('/update/c/:commentId').patch(verifyJWT, updateComment)
router.route('/delete/c/:commentId').delete(verifyJWT, deleteComment)
router.route('/videos/comment/:videoId').get(verifyJWT, getVideoComments)

export default router