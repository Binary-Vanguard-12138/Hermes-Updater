const express = require("express");

const { onStartScrape, onFoundNewProductSchema, onFoundNewProduct } = require("../../../controllers/notify/product");

const router = express.Router();

// @route    GET api/notify/product/on_start_scrape
// @desc     Return the current user
// @param
// @access   Public

router.get("/on_start_scrape", onStartScrape);

// @route    POST api/notify/product/on_find_new
// @desc     Return the current user
// @param    url
// @access   Public

router.post("/on_find_new", onFoundNewProductSchema, onFoundNewProduct);

module.exports = router;
