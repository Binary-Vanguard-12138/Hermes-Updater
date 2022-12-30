function generateMaskedString(len) {
    let str = "";
    for (let i = 0; i < len; i++) {
        str += "*";
    }
    return str;
}

const REVEAL_LENGTH = 4;
const MAX_MASKED_STRING_LENGTH = 20;

function getMaskedString(str, reveal_len) {
    const len = str.length;
    if (undefined === reveal_len) {
        reveal_len = REVEAL_LENGTH;
    }
    if (2 * reveal_len > len) {
        return generateMaskedString(len);
    }
    return (
        str.substr(0, reveal_len) +
        generateMaskedString(
            MAX_MASKED_STRING_LENGTH > len
                ? len - 2 * reveal_len
                : MAX_MASKED_STRING_LENGTH - 2 * REVEAL_LENGTH
        ) +
        str.substr(len - reveal_len)
    );
}

function template(sContent, data) {
    return sContent.replace(
        /%(\w*)%/g, // or /{(\w*)}/g for "{this} instead of %this%"
        function (m, key) {
            return data.hasOwnProperty(key) ? data[key] : "";
        }
    );
}

function capitalizeFirstLetter(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = { getMaskedString, template, capitalizeFirstLetter };
