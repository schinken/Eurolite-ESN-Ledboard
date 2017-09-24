'use strict';

const path = require('path');
const configurations = require('configurations');

module.exports.get = (externalConfig) => {
    return configurations.load(path.join(__dirname, '../config'), {
        externalconfig: externalConfig
    });
};