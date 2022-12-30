const Joi = require("joi");
const validateRequest = require("../middleware/validate-request");

function isValidString(str) {
    return (
        undefined !== str &&
        null !== str &&
        "string" === typeof str &&
        0 < str.length
    );
}

function isValidHttpUrl(string) {
    let url;
    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }
    return "http:" === url.protocol || "https:" === url.protocol;
}

function isValidArray(arr) {
    return (
        undefined !== arr &&
        null !== arr &&
        "object" === typeof arr &&
        Array.isArray(arr) &&
        0 < arr.length
    );
}

function getPaginationSchema(req, res, next) {
    const schema = Joi.object({
        from: Joi.number().integer(),
        size: Joi.number().integer(),
    });
    validateRequest(req, next, schema);
}

module.exports = {
    isValidString,
    isValidArray,
    isValidHttpUrl,
    getPaginationSchema,
};
