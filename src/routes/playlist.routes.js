import { Router } from "express"
import { addVideoToPlaylist, createPlaylist, deletePlaylist, removeVideoFromPlaylist, getPlaylistById, updatePlaylist, getUserPlaylists } from "../controllers/playlist.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

// Create a new playlist
router.route('/').post(verifyJWT, createPlaylist);

router.route('/user/:userId').get(verifyJWT, getUserPlaylists);

// Add or remove a video from a playlist
router.route('/add/:videoId/:playlistId').patch(verifyJWT, addVideoToPlaylist) // Add video to playlist
router.route('/remove/:videoId/:playlistId').patch(verifyJWT, removeVideoFromPlaylist); // Remove video from playlist

// Manage a specific playlist
router
    .route('/:playlistId')
    .patch(verifyJWT, updatePlaylist) // Update playlist details
    .get(verifyJWT, getPlaylistById) // Get playlist by ID
    .delete(verifyJWT, deletePlaylist); // Delete playlist
// TODO: add a avatar functionality in playlist
export default router