function getImageUrlFromProductUrl(url) {
    // Trim the last slash
    if (url.substring(url.length - 1) === '/') {
        url = url.substring(0, url.length - 1);
    }
    if (10 > url.length) {
        return undefined;
    }
    img_url = `https://assets.hermes.com/is/image/hermesproduct/${url.substring(url.length - 10)}_set`;
    return img_url;
}

module.exports = { getImageUrlFromProductUrl }