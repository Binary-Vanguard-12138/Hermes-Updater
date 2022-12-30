const winston = require("winston");
const { isValidString } = require("./validator");

const options = {
    file: {
        level: "debug",
        filename: "./logs/app.log",
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    },
    console: {
        level: "debug",
        handleExceptions: true,
        json: false,
        colorize: true,
    },
};

function getRequestLogFormatter() {
    const { combine, timestamp, json, printf } = winston.format;

    return combine(
        timestamp() /*,
        json() */,
        printf((info) => {
            sMsg = info.timestamp + " " + info.level + ": " + info.message;
            if (isValidString(info.method)) {
                sMsg +=
                    " " +
                    info.method +
                    " " +
                    info.host +
                    " " +
                    info.url +
                    " " +
                    info.status +
                    " " +
                    info.contentLength +
                    " " +
                    info.responseTime;
            }
            if (isValidString(info.body)) {
                sMsg += "\n" + info.body;
            }
            return sMsg;
        })
    );
}

const logger = winston.createLogger({
    levels: winston.config.npm.levels,
    transports: [
        new winston.transports.File(options.file),
        // new winston.transports.Console(options.console),
    ],
    format: getRequestLogFormatter(),
    exitOnError: false,
});

module.exports = logger;
