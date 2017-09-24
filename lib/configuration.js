const path = require('path');
const configurations = require('configurations');

module.exports = configurations.load(path.join(__dirname, '../config'));