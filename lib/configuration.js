var path = require('path');
var configurations = require('configurations');

module.exports = configurations.load(path.join(__dirname, '../config'));