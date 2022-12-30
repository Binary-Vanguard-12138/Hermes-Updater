const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("./send-email");
const db = require("./db");
const config = require("config");
const { UserModel } = require("../models/User");
const { template } = require("./string");
const logger = require("./logger");

async function getAccount(id) {
    if (!db.isValidId(id)) throw "Account not found";
    const account = await UserModel.findById(id);
    if (!account) throw "Account not found";
    return account;
}

function hash(password) {
    return bcrypt.hashSync(password, 10);
}

function generateJwtToken(account) {
    // create a jwt token containing the account id that expires in 15 minutes
    const payload = {
        id: account.id,
    };
    return jwt.sign(payload, config.get("jwtSecret"), {
        expiresIn: "60m",
        algorithm: "HS512",
    });
}

function randomTokenString() {
    return crypto.randomBytes(40).toString("hex");
}

function basicAccountDetails(account) {
    const {
        id,
        firstName,
        lastName,
        email,
        role,
        created_at,
        updated_at,
        isDeleted,
        isVerified,
        enabled,
    } = account;
    return {
        id,
        firstName,
        lastName,
        email,
        role,
        created_at,
        updated_at,
        isDeleted,
        isVerified,
        enabled,
    };
}

async function sendVerificationEmail(account, origin) {
    logger.debug(`sendVerificationEmail ${account.email}`);
    let message;
    let subject;
    let from;
    let html;

    if (!origin) {
        // message = `<p>Please use the below token to verify your email address with the <code>auth/verify-email</code> api route:</p>
        //            <p><code>${account.verificationToken}</code></p>`;
        throw `Can not get Origin header from request`;
    }
    const verifyUrl = `${origin}/auth/verify-email/${account.verificationToken}`;
    subject = "Sign-up Verification API - Verify Email";
    message = `<p>Please click the below link to verify your email address:</p>
    <p><a href="${verifyUrl}" target="_blank" style="border:2px solid #ffffff;background-color:#2557a7;border-radius:8px;color:#ffffff;display:inline-block;font-family:'Noto Sans',Helvetica,Arial,sans-serif;font-size:16px;font-weight:bold;line-height:44px;text-align:center;text-decoration:none;width:240px">Verify Email</a></p>`;

    await sendEmail({
        to: account.email,
        subject,
        html:
            html ||
            `<h4>Verify Email</h4>
               <p>Thanks for registering!</p>
               ${message}`,
        from,
    });
}

async function sendAlreadyRegisteredEmail(email, origin) {
    let message;
    if (origin) {
        message = `<p>If you don't know your password please visit the <a href="${origin}/auth/forgotpassword">forgot password</a> page.</p>`;
    } else {
        message = `<p>If you don't know your password you can reset it via the <code>/auth/forgotpassword</code> api route.</p>`;
    }

    await sendEmail({
        to: email,
        subject: "Sign-up Verification API - Email Already Registered",
        html: `<h4>Email Already Registered</h4>
               <p>Your email <strong>${email}</strong> is already registered.</p>
               ${message}`,
    });
}

async function sendPasswordResetEmail(account, origin) {
    logger.debug(`sendPasswordResetEmail ${account.email}`);
    let message;
    let html;
    let from;
    let subject;
    if (!origin) {
        // message = `<p>Please use the below token to reset your password with the <code>/auth/reset-password</code> api route:</p>
        //            <p><code>${account.resetToken.token}</code></p>`;
        throw `Can not get Origin header from request`;
    }
    const resetUrl = `${origin}/auth/reset-password/${account.resetToken.token}`;
    subject = "Sign-up Verification API - Reset Password";
    message = `<p>Please click the below link to reset your password, the link will be valid for 1 day:</p>
    <p><a href="${resetUrl}">${resetUrl}</a></p>`;

    await sendEmail({
        to: account.email,
        subject,
        html:
            html ||
            `<h4>Reset Password Email</h4>
               ${message}`,
        from,
    });
}

function setTokenCookie(res, token) {
    // create cookie with refresh token that expires in 7 days
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };
    res.cookie("refreshToken", token, cookieOptions);
}

module.exports = {
    getAccount,
    hash,
    generateJwtToken,
    randomTokenString,
    setTokenCookie,
    basicAccountDetails,
    sendVerificationEmail,
    sendAlreadyRegisteredEmail,
    sendPasswordResetEmail,
};
