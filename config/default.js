'use strict';
const ms = require('ms');

module.exports = {

    mode: 'default',

    status: {
        url: 'http://status.bckspc.de/status.php?response=json',
        interval: 120
    },

    ping: {
        interval: ms('10s'),
        consecutiveAnswers: 3
    },

    mqtt: {
        host: 'mqtt.core.bckspc.de'
    }
};
