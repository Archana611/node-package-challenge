class APIException extends Error {
    /*
     * @param {string} message - error message
     */
    constructor(message: string) {
        super(message);
        this.name = 'APIException'
    }
}

export { APIException };