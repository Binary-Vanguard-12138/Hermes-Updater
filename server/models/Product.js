const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = Schema({
    url: {
        type: String,
        required: true,
        unique: true
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
