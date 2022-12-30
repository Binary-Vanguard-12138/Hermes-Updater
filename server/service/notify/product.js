const logger = require("../../helpers/logger");
const { NotFoundError } = require("../../middleware/error-handler");
const sendEmail = require("../../helpers/send-email");
const { isValidString } = require("../../helpers/validator");

async function onFoundNewProduct(params) {}

module.exports = { onFoundNewProduct };
