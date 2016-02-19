var StatusAPI = require('bckspc-status');
var mqtt = require('mqtt');

var LedBoardClient = require('./lib/LedBoard/Client');
var configuration = require('./lib/configuration');
var PingProbe = require('./lib/Utils/PingProbe');
var screens = require('./lib/Screens');

var mqttClient = mqtt.connect('mqtt://' + configuration.mqtt.host);

mqttClient.subscribe('psa/alarm');
mqttClient.subscribe('psa/donation');
mqttClient.subscribe('psa/pizza');
mqttClient.subscribe('psa/newMember');
mqttClient.subscribe('psa/message');
mqttClient.subscribe('sensor/door/bell');

var ledBoard = new LedBoardClient(configuration.ledboard.host);

var statusApi = new StatusAPI(configuration.status.url, configuration.status.interval);
var memberCount = 0;

statusApi.on('member_count', function (currentMemberCount) {
    memberCount = currentMemberCount;
    ledBoard.sendScreen(screens.idle(currentMemberCount));
});

mqttClient.on('message', function (topic, payload) {

    console.log("Received mqtt topic " + topic + " with value '" + payload + "'");
    switch (topic) {

        case 'psa/pizza':
            ledBoard.sendScreens([screens.pizzaTimer(), screens.idle(memberCount)]);
            break;

        case 'psa/donation':
            ledBoard.sendScreens([screens.donation(), screens.idle(memberCount)]);
            break;

        case 'psa/alarm':
            ledBoard.sendScreens([screens.alarm(payload), screens.idle(memberCount)]);
            break;

        case 'psa/newMember':
            ledBoard.sendScreens([screens.newMemberRegistration(payload), screens.idle(memberCount)]);
            break;

        case 'sensor/door/bell':
            if (payload) {
                ledBoard.sendScreens([screens.doorBell(), screens.idle(memberCount)]);
            }
            break;

        case 'psa/message':
            if (payload) {
                ledBoard.sendScreens([screens.publicServiceAnnouncement(payload), screens.idle(memberCount)]);
            }
            break;
    }
});

var aliveProbe = new PingProbe(configuration.ledboard.host);
aliveProbe.on('alive', function () {
    ledBoard.sendScreen(screens.idle(memberCount));
});

