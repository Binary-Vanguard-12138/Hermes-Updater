const Joi = require("joi");

const validateRequest = require("../../middleware/validate-request");
const accountService = require("../../service/account");

const { setTokenCookie } = require("../../helpers/account");
const { UserRole } = require("../../constants/User");

function authenticateSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
    });
    validateRequest(req, next, schema);
}

function authenticate(req, res, next) {
    const { email, password } = req.body;
    const ipAddress = req.ip;
    accountService
        .authenticate({ email, password, ipAddress }, false)
        .then(({ refreshToken, ...account }) => {
            setTokenCookie(res, refreshToken);
            res.json(account);
        })
        .catch(next);
}
// function isVerified(req, res, next) {
//     const { email, password } = req.body;
//     accountService
//         .isVerified({ email, password })
//         .then(({ isVerified, passwordCheck }) => {
//             res.json({ isVerified, passwordCheck });
//         })
//         .catch(next);
// }
function getUser(req, res, next) {
    accountService
        .getUser(req)
        .then((user) => res.json(user))
        .catch(next);
}

function updateCurrentUserSchema(req, res, next) {
    const schema = Joi.object({
        firstName: Joi.string().empty(""),
        lastName: Joi.string().empty(""),
        oldPassword: Joi.string().empty(""),
        password: Joi.string().min(6).empty(""),
    });
    validateRequest(req, next, schema);
}

function updateCurrentUser(req, res, next) {
    accountService
        .updateCurrentUser(req)
        .then((user) => res.json(user))
        .catch(next);
}

function registerUserSchema(req, res, next) {
    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    });
    validateRequest(req, next, schema);
}

function registerUser(req, res, next) {
    accountService
        .registerUser(req.body, req.get("origin"))
        .then(() =>
            res.json({
                message:
                    "Registration successful, please check your email for verification instructions",
            })
        )
        .catch(next);
}

function verifyEmailSchema(req, res, next) {
    const schema = Joi.object({
        token: Joi.string().required(),
    });
    validateRequest(req, next, schema);
}

function verifyEmail(req, res, next) {
    const { token } = req.body;
    accountService
        .verifyEmail(token)
        .then(() =>
            res.json({
                message: "Verification Success. You can sign in right now.",
            })
        )
        .catch(next);
}

function forgotPasswordSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
    });
    validateRequest(req, next, schema);
}

function forgotPassword(req, res, next) {
    accountService
        .forgotPassword(req.body, req.get("origin"))
        .then(() =>
            res.json({
                message:
                    "Please check your email for password reset instructions",
            })
        )
        .catch(next);
}

function resetPasswordSchema(req, res, next) {
    const schema = Joi.object({
        token: Joi.string().required(),
        password: Joi.string().min(6).required(),
    });
    validateRequest(req, next, schema);
}

function resetPassword(req, res, next) {
    accountService
        .resetPassword(req.body)
        .then(() =>
            res.json({
                message: "Password reset successful, you can now login",
            })
        )
        .catch(next);
}

module.exports = {
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
};
