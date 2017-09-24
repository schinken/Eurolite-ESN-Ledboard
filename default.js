'use strict';

const StatusAPI = require('bckspc-status');
const mqtt = require('mqtt');
const LedBoardClient = require('./lib/LedBoard/Client');
const PingProbe = require('./lib/Utils/PingProbe');
const screens = require('./lib/Screens');

module.exports.run = (config) => {
    const mqttClient = mqtt.connect('mqtt://' + config.mqtt.host);

    mqttClient.subscribe('psa/alarm');
    mqttClient.subscribe('psa/donation');
    mqttClient.subscribe('psa/pizza');
    mqttClient.subscribe('psa/newMember');
    mqttClient.subscribe('psa/message');
    mqttClient.subscribe('sensor/door/bell');

    const ledBoard = new LedBoardClient(config.host);

    const statusApi = new StatusAPI(config.status.url, config.status.interval);
    let memberCount = 0;

    statusApi.on('member_count', (currentMemberCount) => {
        memberCount = currentMemberCount;
        ledBoard.sendScreen(screens.idle(currentMemberCount));
    });

    mqttClient.on('message', function (topic, payload) {

        const message = '' + payload;

        console.log("Received mqtt topic " + topic + " with value '" + message + "'");
        switch (topic) {

            case 'psa/pizza':
                ledBoard.sendScreens([screens.pizzaTimer(), screens.idle(memberCount)]);
                break;

            case 'psa/donation':
                ledBoard.sendScreens([screens.donation(), screens.idle(memberCount)]);
                break;

            case 'psa/alarm':
                ledBoard.sendScreens([screens.alarm(message), screens.idle(memberCount)]);
                break;

            case 'psa/newMember':
                ledBoard.sendScreens([screens.newMemberRegistration(payload), screens.idle(memberCount)]);
                break;

            case 'sensor/door/bell':
                if (message == 'pressed') {
                    ledBoard.sendScreens([screens.doorBell(), screens.idle(memberCount)]);
                }
                break;

            case 'psa/message':
                if (message) {
                    ledBoard.sendScreens([screens.publicServiceAnnouncement(message), screens.idle(memberCount)]);
                }
                break;
        }
    });

    const aliveProbe = new PingProbe(config.host);
    aliveProbe.on('alive', () => {
        ledBoard.sendScreen(screens.idle(memberCount));
    });
};
