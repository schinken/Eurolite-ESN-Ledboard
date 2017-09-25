'use strict';

const UMLAUTS_MAPPING = {'ä': 'ae', 'ü': 'ue', 'ö': 'oe', 'ß': 'sz'};

module.exports.sanitizeUmlauts = (message) => {

    Object.keys(UMLAUTS_MAPPING).forEach((key) => {
        message = message.replace(key, UMLAUTS_MAPPING[key]);
    });

    return message;
};

module.exports.byte2hex = (byte) => {
    const high = Math.floor(byte / 10);
    const low = Math.floor(byte % 10);

    return String.fromCharCode((high << 4) + low);
};