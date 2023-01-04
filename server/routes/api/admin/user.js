const express = require("express");
const { UserRole } = require("../../../constants/User");

const authorize = require("../../../middleware/authorize");

const { getUsers, getUserById } = require("../../../controllers/admin/user");

const router = express.Router();

// @route    GET api/admin/user
// @desc     Return users
// @param
// @access   Private

router.get("/", authorize(UserRole.SUPER_ADMIN), getUsers);

// @route    GET api/admin/user/:uid
// @desc     Return a user
// @param
// @access   Private

router.get("/:uid", authorize(UserRole.SUPER_ADMIN), getUserById);

module.exports = router;
