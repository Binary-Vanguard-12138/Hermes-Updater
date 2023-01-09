const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = Schema({
    url: {
        type: String,
        required: true,
        unique: true,
    },
    image_url: {
        type: String,
        required: true,
        unique: true,
        sparse: true, // unique if not null
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        required: true,
    },
});

ProductSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
    },
});

const ProductModel = mongoose.model("product", ProductSchema);

module.exports = { ProductModel, ProductSchema };
