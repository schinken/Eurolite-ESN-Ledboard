'use strict';

module.exports = {

    mode: 'default',

    status: {
        url: 'http://status.bckspc.de/status.php?response=json',
        interval: 120
    },

    mqtt: {
        host: 'mqtt.core.bckspc.de'
    }
};
