const Joi = require("joi");
const validateRequest = require("../../middleware/validate-request");

const pdService = require("../../service/notify/product");

function onStartScrape(req, res, next) {
    pdService
        .onStartScrape()
        .then(() => res.json({ msg: "Success" }))
        .catch(next);
}

function onFoundNewProductSchema(req, res, next) {
    const schema = Joi.object({ url: Joi.string().required() });
    validateRequest(req, next, schema);
}

function onFoundNewProduct(req, res, next) {
    const { url } = req.body;
    pdService
        .onFoundNewProduct(url)
        .then(() => res.json({ msg: "Success" }))
        .catch(next);
}

module.exports = { onStartScrape, onFoundNewProductSchema, onFoundNewProduct };
