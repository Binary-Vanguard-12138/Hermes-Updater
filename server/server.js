const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const ipfilter = require("express-ipfilter").IpFilter;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { errorHandler } = require("./middleware/error-handler");
const logger = require("./helpers/logger");
const httpLogger = require("./helpers/httpLogger");
const morgan = require("morgan");

const connectDB = require("./config/db");
const { INTERNAL_PORT } = require("./constants/App");

const app = express();
app.use(helmet());

// Connect Database
connectDB();

// Allow the following IPs
const ips = ["::ffff:127.0.0.1", "::1"];
app.use(ipfilter(ips, { mode: "allow" }));

// Init Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// allow cors requests from any origin and with credentials
app.use(
    cors({
        origin: (origin, callback) => callback(null, true),
        credentials: true,
    })
);

app.use(httpLogger);
morgan.token("body", (req) => {
    return JSON.stringify(req.body);
});
morgan.token("host", (req, res) => {
    return req.hostname;
});

// Define Routes
// User routes
app.use("/api/user/v1", require("./routes/api/user/v1"));

// Super Admin routes should be available for OMB-Serivce, since it contains /api/admin/v1/node route.
app.use("/api/admin", require("./routes/api/admin"));

// Notify routes
app.use("/api/notify", require("./routes/api/notify"));

// global error handler
app.use(errorHandler);

/*
// Serve static assets in production
if (process.env.NODE_ENV === "production") {
    // Set static folder
    app.use(express.static("client/build"));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
}
*/
app.on("db_ready", async () => {
    // start the Express server
    app.listen(INTERNAL_PORT, () =>
        logger.info(
            `SenseDefence Admin backend server started on port ${INTERNAL_PORT}`
        )
    );
});

mongoose.connection.once("open", () => {
    app.emit("db_ready");
});
