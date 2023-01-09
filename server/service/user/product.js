const { getMongooseLimitParam } = require("../../helpers/db");
const { ProductModel } = require("../../models/Product");

async function getProducts(from, size) {
    const lmt = getMongooseLimitParam(from, size);
    const cond = {};
    const total = await ProductModel.countDocuments(cond);
    const products = await ProductModel.find(cond, "", lmt).sort({ created_at: -1 });
    return { total, data: products };
}

module.exports = { getProducts }