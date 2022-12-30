const { expressjwt } = require("express-jwt");
const config = require("config");
const secret = config.get("jwtSecret");
const { UserModel } = require("../models/User");

module.exports = authorize;

function authorize(roles = []) {
    // roles param can be a single role string (e.g. Role.User or 'User')
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === "number") {
        roles = [roles];
    }
    return [
        // authenticate JWT token and attach user to request object (req.user)
        expressjwt({ secret, algorithms: ["HS512"] }),

        // authorize based on user role
        async (req, res, next) => {
            const user = await UserModel.findById(req.auth.id);
            if (!user || (roles.length && !roles.includes(user.role))) {
                // user no longer exists or role not authorized
                return res.status(401).json({ message: "Unauthorized" });
            }

            req.user = user;
            return next();
        },
    ];
}
