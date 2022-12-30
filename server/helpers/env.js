const { env } = require("process");

function isProductionEnv() {
    return "production" === env.NODE_ENV;
}

module.exports = { isProductionEnv };
