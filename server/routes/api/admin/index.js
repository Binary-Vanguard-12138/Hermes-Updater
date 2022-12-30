const express = require("express");
const { isSecondaryOmb } = require("../../../helpers/env");

const router = express.Router();

router.use("/user", require("./user"));

module.exports = router;
