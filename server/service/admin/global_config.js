const { isValidString } = require("../../helpers/validator");
const { GlobalConfigModel } = require("../../models/GlobalConfig");

async function loadGlobalConfig() {
    let isNew = false;
    let config = await GlobalConfigModel.findOne();
    if (!config) {
        const newConfig = new GlobalConfigModel();
        await newConfig.save();
        config = newConfig;
        isNew = true;
    }
    return { config, isNew };
}

async function saveGlobalConfig(newConfig) {
    if (!newConfig) return;
    await GlobalConfigModel.findOneAndReplace({}, newConfig);
}

async function getGlobalConfig(name) {
    const { config, isNew } = await loadGlobalConfig();
    if (name in config) {
        return config[name];
    }
    return undefined;
}

/**
 *
 * @param {*} key_value
 * @returns true if global configuration record is newly added
 */
async function setGlobalConfig(key, value) {
    if (!isValidString(key)) {
        throw "Can not set empty key in global config";
    }
    let { config, isNew } = await loadGlobalConfig();
    const newConfig = config.toJSON();
    newConfig[key] = value;
    await saveGlobalConfig(newConfig);
    return isNew;
}

module.exports = {
    getGlobalConfig,
    setGlobalConfig,
};
