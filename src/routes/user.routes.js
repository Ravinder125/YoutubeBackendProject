import { Router } from 'express';
import {
    registerUser, loginUser, logoutUser, refreshAccesToken,
    changePassword, updateAvatar, updateCoverImage, getUserChannelProfile, getWatchHistory
} from '../controllers/user.controllers.js';
import { upload } from '../middlewares/multer.middlewares.js';
import { verifyJWT } from '../middlewares/auth.middlewares.js';

const router = Router();


const multerErrorHandler = (err, req, res, next) => {
    if (err) {
        res.status(500).json({ error: err?.message })
    }
    next()
}

// Register router created to handle registeration
router.route('/register').post(
    // /(method) multer.Multer.fields(fields: readonly multer.Field[]): RequestHandler
    // Returns middleware that processes multiple files associated with the given form fields.

    // The Request object will be populated with a files object which maps each field name to an array of the associated file information objects.

    // @param fields — Array of Field objects describing multipart form fields to process.

    // @throws — MulterError('LIMIT_UNEXPECTED_FILE') if more than maxCount files are associated with fieldName for any field.
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
    multerErrorHandler,
    registerUser
);

router.route('/login').post(loginUser);

// secured routes
router.route('/logout').post(verifyJWT, logoutUser);
router.route('/refresh-token').post(refreshAccesToken);
router.route('/change-password').post(verifyJWT, changePassword);
router.route('/update-avatar').patch(verifyJWT, upload.single("avatar"), updateAvatar);
router.route('/update-coverimage').patch(verifyJWT, upload.single("coverImage"), updateCoverImage);
router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
router.route("/watchHistory").get(verifyJWT, getWatchHistory)

export default router;