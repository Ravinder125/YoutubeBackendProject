import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middlewares.js"
import { upload } from "../middlewares/multer.middlewares.js"
import { getAllVideos, uploadVideo, addVideoToHistory, getOwnVideos, updateVideo, deleteVideo, toggleVideoPublish } from "../controllers/video.controllers.js"

const router = Router()
// router.use(verifyJWT)

router.route('/')
    .get(verifyJWT, getAllVideos)
    .post(verifyJWT,
        upload.fields([
            {
                name: 'videoFile',
                maxCount: 1 // how many files with this name we need
            },
            {
                name: 'thumbnail',
                maxCount: 1 // how many files with this name we need

            }
        ]),
        uploadVideo)
router.route('/:videoId').get(verifyJWT, addVideoToHistory).post(verifyJWT, upload.single("thumbnail"), updateVideo)
router.route('/get-own-videos').get(verifyJWT, getOwnVideos)
router.route('/delete/c/:videoId').delete(verifyJWT, deleteVideo);
router.route('/toggle/publish-status/:videoId').patch(verifyJWT, toggleVideoPublish)




export default router