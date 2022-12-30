module.exports = {
    errorHandler,
    UnauthorizedError,
    NotFoundError,
    DuplicatedError,
};
const { IpDeniedError } = require("express-ipfilter");
const logger = require("../helpers/logger");

function UnauthorizedError(message) {
    var e = new Error(message);
    e.name = "UnauthorizedError";
    return e;
}

function NotFoundError(message) {
    var e = new Error(message);
    e.name = "NotFoundError";
    return e;
}

function DuplicatedError(message) {
    var e = new Error(message);
    e.name = "DuplicatedError";
    return e;
}

function errorHandler(err, req, res, next) {
    let statusCode = 400;
    switch (true) {
        case typeof err === "string":
            // custom application error
            const lowerErr = err.toLowerCase();
            if (lowerErr.endsWith("not found")) statusCode = 404;
            if (lowerErr.includes("already")) statusCode = 409;
            logger.error(`status: ${statusCode}, ${err}`);
            return res.status(statusCode).json({ message: err });
        case err.name === "ValidationError":
            // mongoose validation error
            logger.error(`${err.name}, ${err.message}`);
            return res.status(400).json({ message: err.message });
        case err.name === "UnauthorizedError":
            // jwt authentication error
            logger.error(`${err.name}, ${err.message}`);
            return res
                .status(401)
                .json({ message: "Unauthorized\n" + err.message });
        case err.name === "MongoServerError":
            if (
                err.message
                    .toLowerCase()
                    .includes("duplicate key error collection")
            )
                statusCode = 409;
            logger.error(`status:${statusCode}, ${err.name}, ${err.message}`);
            return res.status(statusCode).json({ message: err.message });
        case err.name === "NotFoundError":
            statusCode = 404;
            logger.error(`status: ${statusCode}, ${err}`);
            return res.status(statusCode).json({ message: err.message });
        case err.name === "DuplicatedError":
            statusCode = 409;
            logger.error(`status: ${statusCode}, ${err}`);
            return res.status(statusCode).json({ message: err.message });
        case err instanceof IpDeniedError:
            logger.error(`${err.name}, ${err.message}`);
            return res.status(401).json(err.message);

        default:
            logger.error(`${err.name}, ${err.message}`);
            return res.status(500).json({
                message: err.message,
            });
    }
}
