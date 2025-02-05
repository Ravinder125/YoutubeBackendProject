import fs from "fs/promises"


const cleanUpFiles = async (filesPaths) => {
    for (const filePath of filesPaths) {

        if (filePath) {
            try {
                await fs.unlink(filePath)
                console.log(`${filePath} file deleted from local system`)
            } catch (error) {
                console.error(`failed to delete the ${filePath}`)
            }
        }
    }
}

export { cleanUpFiles }