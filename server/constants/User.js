const UserRole = {
    SUPER_ADMIN: 0,
    ORGANISATION_ACCOUNT: 1,
};

const DeleteUserAction = {
    MIN: 1,
    DELETE: 1,
    DISABLE: 2,
    MAX: 2,
};
module.exports = { UserRole, DeleteUserAction };
