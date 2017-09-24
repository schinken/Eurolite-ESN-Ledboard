'use strict';

const StatusAPI = require('bckspc-status');
const mqtt = require('mqtt');
const LedBoardClient = require('./lib/LedBoard/Client');
const PingProbe = require('./lib/Utils/PingProbe');
const screens = require('./lib/Screens');

module.exports.run = (hostname, config) => {

    let memberCount = 0;

    const defaultIdleScreen = _ => screens.idle(memberCount);
    const laserActiveIdleScreen = _ => screens.laserOperation();
    let idleScreen = defaultIdleScreen;

    const statusApi = new StatusAPI(config.status.url, config.status.interval);
    const mqttClient = mqtt.connect('mqtt://' + config.mqtt.host);
    const ledBoard = new LedBoardClient(hostname);


    mqttClient.subscribe('project/laser/operation');
    mqttClient.subscribe('project/laser/finished');

    mqttClient.subscribe('psa/alarm');
    mqttClient.subscribe('psa/pizza');
    mqttClient.subscribe('psa/message');
    mqttClient.subscribe('sensor/door/bell');

    statusApi.on('member_count', (currentMemberCount) => {
        memberCount = currentMemberCount;
        ledBoard.sendScreen(idleScreen());
    });


    mqttClient.on('message', function (topic, payload) {

        const message = '' + payload;

        console.log("Received mqtt topic " + topic + " with value '" + message + "'");
        switch (topic) {

            case 'project/laser/operation':
                if (message == 'active') {
                    idleScreen = laserActiveIdleScreen;

                    // Use the internal datetime to produce a counting screen!
                    const nullDate = new Date(0, 0, 0, 0, 0, 0, 0);
                    ledBoard.setDate(nullDate);

                    ledBoard.sendScreen(screens.laserOperation());
                } else {
                    idleScreen = defaultIdleScreen;
                }

                break;

            case 'project/laser/finished':
                if (message) {
                    ledBoard.sendScreens([screens.laserFinished(message), defaultIdleScreen()]);

                    // Reset datetime to something useful
                    ledBoard.setDate(new Date());
                }
                break;

            case 'psa/pizza':
                ledBoard.sendScreens([screens.pizzaTimer(), idleScreen()]);
                break;

            case 'psa/alarm':
                ledBoard.sendScreens([screens.alarm(message), idleScreen()]);
                break;

            case 'sensor/door/bell':
                if (message == 'pressed') {
                    ledBoard.sendScreens([screens.doorBell(), idleScreen()]);
                }
                break;

            case 'psa/message':
                if (message) {
                    ledBoard.sendScreens([screens.publicServiceAnnouncement(message), idleScreen()]);
                }
                break;
        }
    });
};
