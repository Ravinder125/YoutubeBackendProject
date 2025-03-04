import { Router } from "express";
import { 
    createComment,
    deleteComment,
    getVideoComments,
    updateComment 
} from "../controllers/comment.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router()

router
    .route('/:videoId')
    .post(verifyJWT, createComment)
    .get(verifyJWT, getVideoComments)
router
    .route('/c/:commentId')
    .patch(verifyJWT, updateComment)
    .delete(verifyJWT, deleteComment)

export default router