class apiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message)
        this.statusCode = statusCode;
        // assingToME: read about data 
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = errors

        // it shows where the error occured 
        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
            // if not found then create new one 
        }
    }
}


export { apiError }