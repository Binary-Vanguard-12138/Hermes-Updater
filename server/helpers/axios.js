const axios = require("axios");
const https = require("https");

const axiosInstance = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false,
    }),
});

module.exports = axiosInstance;
