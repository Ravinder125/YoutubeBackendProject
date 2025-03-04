import { Router } from 'express';
import {
    registerUser, 
    getWatchHistory, 
    loginUser, 
    logoutUser, 
    refreshAccesToken, 
    changePassword, 
    updateAvatar, 
    updateCoverImage, 
    getUserChannelProfile, 
    getUserProfile
}
    from '../controllers/user.controllers.js';
import { upload } from '../middlewares/multer.middlewares.js';
import { verifyJWT } from '../middlewares/auth.middlewares.js';

const router = Router();

// /(method) multer.Multer.fields(fields: readonly multer.Field[]): RequestHandler
// Returns middleware that processes multiple files associated with the given form fields.

// The Request object will be populated with a files object which maps each field name to an array of the associated file information objects.

// @param fields — Array of Field objects describing multipart form fields to process.

// @throws — MulterError('LIMIT_UNEXPECTED_FILE') if more than maxCount files are associated with fieldName for any field.

// Register router created to handle registeration
router.route('/register').post(
    upload.fields([
        {
            name: 'avatar',
            maxCount: 1 // how many files with this name we need
        },
        {
            name: 'coverImage',
            maxCount: 1 // how many files with this name we need

        }
    ]),
    registerUser
);

// Authenticantion routes
router.route('/login').post(loginUser);
router.route('/logout').post(verifyJWT, logoutUser);
router.route('/refresh-token').post(refreshAccesToken);
router.route('/change-password').post(verifyJWT, changePassword);

// Profile management routes
router.route('/avatar').patch(verifyJWT, upload.single("avatar"), updateAvatar);
router.route('/cover-image').patch(verifyJWT, upload.single("coverImage"), updateCoverImage);
router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
router.route('/profile').get(verifyJWT, getUserProfile)

// User activity routes
router.route('/history').get(verifyJWT, getWatchHistory)


export default router;