import { Router } from "express"
import { addVideoToPlaylist, createPlaylist, deletePlaylist, removeVideoFromPlaylist, getPlaylistById, updatePlaylist, getUserPlaylists } from "../controllers/playlist.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

// Create a new playlist
router.route('/create/playlist').post(verifyJWT, createPlaylist);

router.route('/get/user/playlists').get(verifyJWT, getUserPlaylists);

// Add or remove a video from a playlist
router.route('/add/:playlistId/:videoId').patch(verifyJWT, addVideoToPlaylist) // Add video to playlist
router.route('/remove/:playlistId/:videoId').patch(verifyJWT, removeVideoFromPlaylist); // Remove video from playlist

// Manage a specific playlist
router
    .route('/playlist/:playlistId')
    .patch(verifyJWT, updatePlaylist) // Update playlist details
    .get(verifyJWT, getPlaylistById) // Get playlist by ID
    .delete(verifyJWT, deletePlaylist); // Delete playlist
// TODO: add a avatar functionality in playlist
export default router