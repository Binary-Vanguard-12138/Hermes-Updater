const { capitalizeFirstLetter } = require("../helpers/string");

module.exports = validateRequest;

function getErrorMessage(x) {
    const key = x.context.key;
    const type = x.type;
    if (type.endsWith(".empty")) {
        return capitalizeFirstLetter(key) + " should not be empty";
    } else if (type.endsWith(".required")) {
        return capitalizeFirstLetter(key) + " is required";
    }
    return x.message;
}

function validateRequest(req, next, schema) {
    const options = {
        errors: {
            label: "key",
            wrap: { label: false, key: false },
        },
        abortEarly: true, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true, // remove unknown props
    };

    let err_val = schema.validate(req.body, options);
    let error = err_val.error;
    let value = err_val.value;
    if (!error && value) {
        req.body = value;
        next();
        return;
    }

    err_val = schema.validate(req.params, options);
    error = err_val.error;
    value = err_val.value;

    if (!error && value) {
        req.params = value;
        next();
        return;
    }

    err_val = schema.validate(req.query, options);
    error = err_val.error;
    value = err_val.value;
    if (!error && value) {
        req.query = value;
        next();
        return;
    }

    next(`${error.details.map((x) => getErrorMessage(x)).join(", ")}`);
}
