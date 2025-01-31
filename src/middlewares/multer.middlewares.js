import multer from "multer";

// We are going to upload fle in diskStorage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // To where the file to be stored
        cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
        // What name to be set to the file
        console.log(file)
        cb(null, file.originalname)
    }
})

export const upload = multer({ storage, })