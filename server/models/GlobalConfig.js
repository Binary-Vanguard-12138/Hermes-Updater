const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GlobalConfigSchema = Schema({
    last_scraped_at: {
        type: Date,
    },
});

GlobalConfigSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
    },
});

const GlobalConfigModel = mongoose.model("globalconfig", GlobalConfigSchema);

module.exports = { GlobalConfigModel, GlobalConfigSchema };
