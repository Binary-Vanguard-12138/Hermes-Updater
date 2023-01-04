const { UserRole } = require("../../constants/User");
const { basicAccountDetails } = require("../../helpers/account");
const { NotFoundError } = require("../../middleware/error-handler");
const { UserModel } = require("../../models/User");
const { getMongooseLimitParam } = require("../../helpers/db");

async function getAllUsers() {
    const users = await UserModel.find({
        role: { $gt: UserRole.SUPER_ADMIN },
    }).sort({ created: -1 });
    return users.map((user) => ({ id: user.id, email: user.email }));
}

async function getUsers(from, size) {
    const lmt = getMongooseLimitParam(from, size);
    const cond = { role: { $gt: UserRole.SUPER_ADMIN } };

    const total = await UserModel.countDocuments(cond);
    const users = await UserModel.find(cond, "", lmt).sort({ created_at: -1 });
    const data = users.map((user) => {
        return basicAccountDetails(user);
    });
    return { total, data };
}

async function getUserById(uid) {
    const user = await UserModel.findById(uid);
    if (!user) {
        throw NotFoundError(`User ${uid} not found`);
    }
    return basicAccountDetails(user);
}
module.exports = { getAllUsers, getUsers, getUserById };
