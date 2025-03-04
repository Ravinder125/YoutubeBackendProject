import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middlewares.js"
import { upload } from "../middlewares/multer.middlewares.js"
import { 
    getAllVideos, 
    uploadVideo, 
    updateVideo, 
    deleteVideo, 
    toggleVideoPublish, 
    watchVideo
} 
from "../controllers/video.controllers.js"

const router = Router()

// Crud operations on Videos
router
    .route('/')
    .get(verifyJWT, getAllVideos)
    .post(verifyJWT,
        upload.fields([
            { name: 'videoFile', maxCount: 1 },
            /* how many files with this name we need */
            { name: 'thumbnail', maxCount: 1 }
        ]),
        uploadVideo)

router
    .route('/:videoId')
    .put(verifyJWT, upload.single("thumbnail"), updateVideo)
    .patch(verifyJWT, watchVideo)
    .delete(verifyJWT, deleteVideo)

// Toggle video publish
router.route('/toggle/publish/:videoId').patch(verifyJWT, toggleVideoPublish)




export default router