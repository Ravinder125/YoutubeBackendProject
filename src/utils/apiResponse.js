export class apiResponse {
    constructor(status, data, message) {
        this.status = status;
        this.data = data //JSON.parse(JSON.stringify(data)); // Remove circular references
        this.message = message;
    }
}
