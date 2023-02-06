function getImageUrlFromProductUrl(url) {
    const sku = getProductSkuFromProductUrl(url);
    if (!sku) {
        return undefined;
    }
    img_url = `https://assets.hermes.com/is/image/hermesproduct/${sku}_set`;
    return img_url;
}

function getProductSkuFromProductUrl(url) {
    // Trim the last slash
    if (url.substring(url.length - 1) === '/') {
        url = url.substring(0, url.length - 1);
    }
    if (10 > url.length) {
        return undefined;
    }
    return url.substring(url.length - 10);
}

module.exports = { getImageUrlFromProductUrl, getProductSkuFromProductUrl }