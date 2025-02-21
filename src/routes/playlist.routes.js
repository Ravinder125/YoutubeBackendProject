import { Router } from "express"
import { addVideoToPlaylist, createPlaylist, deleteVideoPlaylist, getPLaylistById } from "../controllers/playlist.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route('/').post(verifyJWT, createPlaylist);
router
    .route('/:playlistId/:videoId')
    .patch(verifyJWT, addVideoToPlaylist)
    .delete(verifyJWT, deleteVideoPlaylist)

router
    .route('/p/:playlistId')
    .get(verifyJWT, getPLaylistById)


export default router