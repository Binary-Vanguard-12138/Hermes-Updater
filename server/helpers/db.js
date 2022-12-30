const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

function isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

function getMongooseLimitParam(from, size) {
    const lmt = {};
    if (0 < from) {
        lmt.skip = from;
    }
    if (0 < size) {
        lmt.limit = size;
    } else {
        lmt.limit = 5;
    }
    return lmt;
}

module.exports = {
    isValidId,
    getMongooseLimitParam,
};
