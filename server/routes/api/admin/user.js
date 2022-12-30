const express = require("express");
const { UserRole } = require("../../../constants/User");

const authorize = require("../../../middleware/authorize");

const {} = require("../../../controllers/admin/user");

const router = express.Router();

module.exports = router;
