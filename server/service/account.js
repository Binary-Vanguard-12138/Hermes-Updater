const bcrypt = require("bcryptjs");

const { UserModel } = require("../models/User");
const { UserRole } = require("../constants/User");
const {
    hash,
    generateJwtToken,
    randomTokenString,
    basicAccountDetails,
    sendVerificationEmail,
    sendAlreadyRegisteredEmail,
    sendPasswordResetEmail,
} = require("../helpers/account");

const { isValidString } = require("../helpers/validator");
const { isProductionEnv } = require("../helpers/env");

async function getUser(req) {
    return basicAccountDetails(req.user);
}

async function authenticate({ email, password, ipAddress }) {
    const account = await UserModel.findOne({ email });

    if (!account) {
        throw "Email or password is incorrect";
    }

    if (!bcrypt.compareSync(password, account.passwordHash)) {
        throw "Email or password is incorrect";
    }

    if (!account.enabled) {
        throw `The account '${email}' is disabled by administrator`;
    }
    if (account.deleted_at) {
        throw `The account '${email}' has been deleted by administrator`;
    }

    // authentication successful so generate jwt and refresh tokens
    const jwtToken = generateJwtToken(account);

    // Save last login date time.
    account.last_login_at = Date.now();
    await account.save();

    // return basic details and tokens
    return {
        ...basicAccountDetails(account),
        jwtToken,
    };
}
// async function isVerified({ email, password }) {
//     const account = await UserModel.findOne({ email });
//     return {
//         isVerified: account.isVerified,
//         passwordCheck: bcrypt.compareSync(password, account.passwordHash),
//     };
// }

async function updateCurrentUser(req) {
    const user = req.user;
    const { firstName, lastName, oldPassword, password } = req.body;
    if (isValidString(firstName)) {
        user.firstName = firstName;
    }
    if (isValidString(lastName)) {
        user.lastName = lastName;
    }
    if (isValidString(password)) {
        if (
            !isValidString(oldPassword) ||
            !bcrypt.compareSync(oldPassword, user.passwordHash)
        ) {
            throw "Invalid password!";
        }
        user.passwordHash = hash(password);
    }
    await user.save();
    return user;
}

async function registerUser(params, origin) {
    // validate
    if (await UserModel.findOne({ email: params.email })) {
        // send already registered error in email to prevent account enumeration
        return await sendAlreadyRegisteredEmail(params.email, origin);
    }

    // create account object
    const account = new UserModel(params);

    // first registered account is an admin
    const isFirstAccount = (await UserModel.countDocuments({})) === 0;
    account.role = isFirstAccount
        ? UserRole.SUPER_ADMIN
        : UserRole.ORGANISATION_ACCOUNT;
    account.verificationToken = randomTokenString();

    // hash password
    account.passwordHash = hash(params.password);

    // save account
    await account.save();

    if (isProductionEnv()) {
        // send email
        await sendVerificationEmail(account, origin);
    }
    return basicAccountDetails(account);
}

async function verifyEmail(token) {
    if (!isValidString(token)) {
        throw "token can not be empty";
    }
    const account = await UserModel.findOne({ verificationToken: token });
    if (!account) throw "Verification Failed";

    account.verified_at = Date.now();
    account.verificationToken = undefined;
    await account.save();
}

async function forgotPassword({ email }, origin) {
    const account = await UserModel.findOne({ email });

    // always return ok response to prevent email enumeration
    if (!account) return;

    // create reset token that expires after 24 hours
    account.resetToken = {
        token: randomTokenString(),
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };
    await account.save();

    // send email
    await sendPasswordResetEmail(account, origin);
}

async function validateResetToken({ token }) {
    const account = await UserModel.findOne({
        "resetToken.token": token,
        "resetToken.expires": { $gt: Date.now() },
    });

    if (!account) throw "Invalid token";
}

async function resetPassword({ token, password }) {
    const account = await UserModel.findOne({
        "resetToken.token": token,
        "resetToken.expires": { $gt: Date.now() },
    });

    if (!account) throw "Invalid token";

    // update password and remove reset token
    account.passwordHash = hash(password);
    account.password_reset_at = Date.now();
    account.resetToken = undefined;
    await account.save();
}

module.exports = {
    getUser,
    updateCurrentUser,
    authenticate,
    registerUser,
    verifyEmail,
    forgotPassword,
    validateResetToken,
    resetPassword,
};
