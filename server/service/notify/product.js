const logger = require("../../helpers/logger");
const sendEmail = require("../../helpers/send-email");
const { ProductModel } = require("../../models/Product");
const { setGlobalConfig, getGlobalConfig } = require("../admin/global_config");
const { UserModel } = require("../../models/User");
const { getImageUrlFromProductUrl } = require("../../helpers/product");

async function onStartScrape() {
    logger.debug(`onStartScrape`);
    await setGlobalConfig("last_scraped_at", Date.now());
}

async function sendEmail2Users(url) {
    const users = await UserModel.find({ enabled: true, deleted_at: { $nin: [undefined, null] } });
    await Promise.all(users.map(async user => {
        const { email } = user;
        await sendEmail({ to: email, subject: "New Product from Hermes", html: `A new product has been arrived:\nLink: ${url}\nTime: ${new Date().toISOString()}` })
    }));
}

async function onFoundNewProduct(url) {
    logger.debug(`onFoundNewProduct '${url}'`);
    const oldProduct = await ProductModel.findOne({ url });
    let isNew = false;
    if (!oldProduct) {
        const image_url = getImageUrlFromProductUrl(url);
        await ProductModel.create({ url, image_url, updated_at: Date.now() });
        isNew = true;
    } else {
        const last_scraped_at = await getGlobalConfig("last_scraped_at") || Date.now();
        if (oldProduct.updated_at < last_scraped_at) {
            isNew = true
        }
        oldProduct.updated_at = Date.now();
        await oldProduct.save();
    }
    if (isNew) {
        logger.debug(`'${url}' is new product`);
        await sendEmail2Users(url);
    }
}

module.exports = { onStartScrape, onFoundNewProduct };
