import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middlewares.js"
import { upload } from "../middlewares/multer.middlewares.js"
import { getAllVideos, uploadVideo, addVideoToHistory, getOwnVideos, updateVideo, deleteVideo, toggleVideoPublish, watchVideo } from "../controllers/video.controllers.js"

const router = Router()

router
    .route('/')
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

router.route('/own/video').get(verifyJWT, getOwnVideos)
router
    .route('/video/v/:videoId')
    .put(verifyJWT, addVideoToHistory)
    .patch(verifyJWT, upload.single("thumbnail"), updateVideo)
    .post(verifyJWT, watchVideo)

router.route('/delete/:videoId').delete(verifyJWT, deleteVideo);
router.route('/toggle/publish-status/:videoId').patch(verifyJWT, toggleVideoPublish)




export default router