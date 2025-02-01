import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

// Register router created to handle registeration
router.route("/register").post(
    // /(method) multer.Multer.fields(fields: readonly multer.Field[]): RequestHandler
    // Returns middleware that processes multiple files associated with the given form fields.
    
    // The Request object will be populated with a files object which maps each field name to an array of the associated file information objects.
    
    // @param fields — Array of Field objects describing multipart form fields to process.
    
    // @throws — MulterError('LIMIT_UNEXPECTED_FILE') if more than maxCount files are associated with fieldName for any field.
    upload.fields([
        {
            name: "avatar",
            maxCount: 1 // how many files with this name we need
        },
        {
            name: "coverImage",
            maxCount: 1 // how many files with this name we need

        }
    ]),
    registerUser);
// router.route("/login").post(loginUser)



export default router;