var UMLAUTS_MAPPING = {'ä': 'ae', 'ü': 'ue', 'ö': 'oe', 'ß': 'sz'};

module.exports.sanitizeUmlauts = function (message) {

    Object.keys(UMLAUTS_MAPPING).forEach(function (key) {
        message = message.replace(key, UMLAUTS_MAPPING[key]);
    });

    return message;
};