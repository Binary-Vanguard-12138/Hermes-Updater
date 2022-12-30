const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserConstants = require("../constants/User");

const UserSchema = Schema({
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    enabled: {
        type: Boolean,
        required: true,
        default: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    role: {
        type: Number,
        required: true,
        default: UserConstants.UserRole.READONLY_USER,
    },
    verificationToken: String,
    verified_at: Date,
    //avatar: String,
    resetToken: {
        token: String,
        expires: Date,
    },
    password_reset_at: Date,
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: Date,
    last_login_at: Date,
    deleted_at: Date,
});

UserSchema.virtual("username").get(function () {
    return this.firstName + " " + this.lastName;
});

UserSchema.virtual("isVerified").get(function () {
    return !!(this.verified_at || this.password_reset_at);
});

UserSchema.virtual("isDeleted").get(function () {
    return !!this.deleted_at;
});

UserSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
        delete ret.passwordHash;
    },
});

const UserModel = mongoose.model("user", UserSchema);

module.exports = { UserModel, UserSchema };
