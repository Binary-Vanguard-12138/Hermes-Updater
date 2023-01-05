const pdService = require("../../service/user/product");

function getProducts(req, res, next) {
    const { from, size } = req.query;
    pdService
        .getProducts(from, size)
        .then((products) => res.json(products))
        .catch(next);
}

module.exports = { getProducts }