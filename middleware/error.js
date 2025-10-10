const errorMiddleware = async (err, req, res, next) => {
    console.log(`Error at : ${req.originalUrl}, msg: ${err.message}, details: ${err}`)
    let message;
    if (err.status == 404) {
        message = err.message;
    }
    else {
        message = 'Oh no! There was a crash.'
    }
    return res.status(err.status || 500).json({
        status: err.status || "Server Error",
        message: message
    })
}

module.exports = errorMiddleware;