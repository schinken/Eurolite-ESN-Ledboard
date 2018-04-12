'use strict';

const mqtt = require('mqtt');
const LedBoardClient = require('./lib/LedBoard/Client');
const PingProbe = require('./lib/Utils/PingProbe');
const screens = require('./lib/Screens');

module.exports.run = (config) => {

    let memberCount = 0;
    let laserActive = false;

    const defaultIdleScreen = _ => screens.idle(memberCount);
    const laserActiveIdleScreen = _ => screens.laserOperation();
    let idleScreen = defaultIdleScreen;

    const mqttClient = mqtt.connect('mqtt://' + config.mqtt.host);
    const ledBoard = new LedBoardClient(config.host);

    // Set time initially
    ledBoard.setDate(new Date());

    mqttClient.subscribe('project/laser/operation');
    mqttClient.subscribe('project/laser/finished');
    mqttClient.subscribe('project/laser/duration');

    mqttClient.subscribe('psa/alarm');
    mqttClient.subscribe('psa/pizza');
    mqttClient.subscribe('psa/message');
    mqttClient.subscribe('sensor/door/bell');
    mqttClient.subscribe('sensor/space/member/present');

    mqttClient.on('message', (topic, payload) => {

        const message = '' + payload;

        console.log("Received mqtt topic " + topic + " with value '" + message + "'");
        switch (topic) {

            case 'sensor/space/member/present':
                memberCount = parseInt(message, 10);

                if (!laserActive) {
                    ledBoard.sendScreen(screens.idle(memberCount));
                }

                break;

            case 'project/laser/operation':
                if (message === 'active') {
                    laserActive = true;
                    idleScreen = laserActiveIdleScreen;

                    // Use the internal datetime to produce a counting screen!
                    const nullDate = new Date(2000, 1, 0, 0, 0, 2, 0);
                    ledBoard.setDate(nullDate);

                    ledBoard.sendScreen(screens.laserOperation());
                } else {
                    laserActive = false;
                    idleScreen = defaultIdleScreen;
                }

                break;

            // We need to correct the time of the LED Board every two minutes or so, because otherwise
            // it get's a bit off
            case 'project/laser/duration':
                const duration = parseInt(message, 10);
                const hours = Math.floor(duration / 3600);
                const minutes = Math.floor(duration / 60);
                const seconds = duration % 60;

                if (minutes % 2 === 0 && seconds === 57) {
                    const correction = new Date(2000, 1, 0, hours, minutes + 1, 0, 0);
                    ledBoard.setDate(correction);
                }

                break;

            case 'project/laser/finished':
                if (message) {
                    const duration = parseInt(message, 10);
                    ledBoard.sendScreens([screens.laserFinished(duration), defaultIdleScreen()]);

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
                if (message === 'pressed') {
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

    const aliveProbe = new PingProbe(config.host, config.ping);
    aliveProbe.on('alive', () => {
        ledBoard.setDate(new Date());
        ledBoard.sendScreen(screens.idle(memberCount));
    });
};
