const Joi = require("joi");
const validateRequest = require("../../middleware/validate-request");

const adService = require("../../service/notify/product");

function onDdosDetectedSchemaSchema(req, res, next) {
    const schema = Joi.object({});
    validateRequest(req, next, schema);
}
function onFoundNewProduct(req, res, next) {
    adService
        .onFoundNewProduct(req.body)
        .then(() => res.json({ msg: "Success" }))
        .catch(next);
}

module.exports = { onDdosDetectedSchemaSchema, onFoundNewProduct };
