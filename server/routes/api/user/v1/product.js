const express = require("express");

const authorize = require("../../../../middleware/authorize");

const { getProducts } = require("../../../../controllers/user/product");

const router = express.Router();

// @route    GET api/user/v1/product/
// @desc     Return products
// @param    from, size
// @access   Private

router.get("/", authorize(), getProducts);

module.exports = router;
