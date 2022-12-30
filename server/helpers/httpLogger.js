const morgan = require("morgan");
const json = require("morgan-json");
const format = json({
    method: ":method",
    url: ":url",
    bodyStr: ":body",
    host: ":host",
    status: ":status",
    contentLength: ":res[content-length]",
    responseTime: ":response-time",
});

const logger = require("./logger");
const { getMaskedString } = require("./string");
const httpLogger = morgan(format, {
    stream: {
        write: (message) => {
            const {
                method,
                host,
                url,
                bodyStr,
                status,
                contentLength,
                responseTime,
            } = JSON.parse(message);

            let containPassword = false;
            const body = JSON.parse(bodyStr);
            if (body && "password" in body) {
                body.password = getMaskedString(body.password, 1);
                containPassword = true;
            }
            logger.info("HTTP", {
                //timestamp: new Date().toString(),
                method,
                url,
                host,
                body: containPassword ? JSON.stringify(body) : bodyStr,
                status: Number(status),
                contentLength,
                responseTime: Number(responseTime),
            });
        },
    },
});

module.exports = httpLogger;
