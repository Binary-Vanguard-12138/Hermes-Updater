const mongoose = require("mongoose");
const config = require("config");
const logger = require("../helpers/logger");
const db = config.get("mongoURI");

const connectDB = async () => {
    try {
        mongoose.set("strictQuery", true);
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        logger.info("MongoDB Connected...");
    } catch (err) {
        logger.error(err.message);
        // Exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;
