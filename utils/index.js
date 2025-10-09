const utils = {}

/**************************************
 * Error helper function
**************************************/
function createError(status, message) {
    let err = new Error(message)
    err.status = status;
    return err
}

// export
module.exports = { utils, createError };

