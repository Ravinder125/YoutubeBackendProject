import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middlewares.js"
import { upload } from "../middlewares/multer.middlewares.js"
import { getAllVideos, uploadVideo, addVideoToHistory, getOwnVideos } from "../controllers/video.controllers.js"

const router = Router()
// router.use(verifyJWT)

router.route('/')
    .get(verifyJWT, getAllVideos)
    .post(upload.fields([
        { name: "videoFile", maxCount: 1 }, { name: "thumbnail", maxCount: 1 }
    ]),
        uploadVideo)
router.route('/video-watched/c/:videoId').get(verifyJWT, addVideoToHistory)
router.route('/get-own-videos').get(verifyJWT, getOwnVideos)




export default router