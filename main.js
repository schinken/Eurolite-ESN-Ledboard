'use strict';

const StatusAPI = require('bckspc-status');
const mqtt = require('mqtt');

const argv = require('yargs')
    .usage('Usage: $0 --hostname [hostname]')
    .demand(['hostname'])
    .argv;

const LedBoardClient = require('./lib/LedBoard/Client');
const configuration = require('./lib/configuration');
const PingProbe = require('./lib/Utils/PingProbe');
const screens = require('./lib/Screens');

const mqttClient = mqtt.connect('mqtt://' + configuration.mqtt.host);

mqttClient.subscribe('psa/alarm');
mqttClient.subscribe('psa/donation');
mqttClient.subscribe('psa/pizza');
mqttClient.subscribe('psa/newMember');
mqttClient.subscribe('psa/message');
mqttClient.subscribe('sensor/door/bell');

const ledBoard = new LedBoardClient(argv.hostname);

const statusApi = new StatusAPI(configuration.status.url, configuration.status.interval);
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

const aliveProbe = new PingProbe(argv.hostname);
aliveProbe.on('alive', () => {
    ledBoard.sendScreen(screens.idle(memberCount));
});

