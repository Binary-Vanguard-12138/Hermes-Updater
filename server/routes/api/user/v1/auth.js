const express = require("express");
const authorize = require("../../../../middleware/authorize");

const {
    getUser,
    updateCurrentUser,
    updateCurrentUserSchema,
    registerUser,
    registerUserSchema,
    verifyEmail,
    verifyEmailSchema,
    authenticate,
    authenticateSchema,
    forgotPassword,
    forgotPasswordSchema,
    resetPassword,
    resetPasswordSchema,
    // isVerified,
} = require("../../../../controllers/user/auth");

const router = express.Router();

// @route    GET api/user/v1/auth/
// @desc     Return the current user
// @param
// @access   Private

router.get("/", authorize(), getUser);

// @route    PATCH api/user/v1/auth/
// @desc     Update the current user
// @param    firstName, lastName, oldPassword, password
// @access   Private

router.patch("/", authorize(), updateCurrentUserSchema, updateCurrentUser);

// @route    POST api/user/v1/auth/register
// @desc     Register an UNVERIFIED user
// @param    firstName, lastName, email, password
// @access   Public

router.post("/register", registerUserSchema, registerUser);

// @route    PATCH api/user/v1/auth/verify-email
// @desc     Verify an user
// @param    token
// @access   Public

router.patch("/verify-email", verifyEmailSchema, verifyEmail);

// @route    POST api/user/v1/auth/login
// @desc     Authenticate user & get token
// @param    email, password
// @access   Public

router.post("/login", authenticateSchema, authenticate);

// @route    POST api/user/v1/auth/forgot-password
// @desc     Request to reset forgotten password
// @param    email
// @access   Public

router.post("/forgot-password", forgotPasswordSchema, forgotPassword);

// @route    POST api/user/v1/auth/reset-password
// @desc     Request to reset forgotten password
// @param    token, password
// @access   Public

router.post("/reset-password", resetPasswordSchema, resetPassword);

module.exports = router;
