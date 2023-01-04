const userService = require("../../service/admin/user");

function getUsers(req, res, next) {
    const { from, size } = req.query;
    if (from || size) {
        userService
            .getUsers(from, size)
            .then((users) => res.json(users))
            .catch(next);
    } else {
        userService
            .getAllUsers()
            .then((users) => res.json(users))
            .catch(next);
    }
}

function getUserById(req, res, next) {
    const { uid } = req.params;
    userService
        .getUserById(uid)
        .then((user) => res.json(user))
        .catch(next);
}

module.exports = { getUsers, getUserById };
