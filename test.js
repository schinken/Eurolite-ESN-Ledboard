'use strict';

const StatusAPI = require('bckspc-status');
const mqtt = require('mqtt');
const LedBoardClient = require('./lib/LedBoard/Client');
const PingProbe = require('./lib/Utils/PingProbe');
const screens = require('./lib/Screens');

const ledBoard = new LedBoardClient('10.1.20.25');

// Set time initially
//ledBoard.setDate(new Date());


// Use the internal datetime to produce a counting screen!
const nullDate = new Date(2000, 1, 0, 0, 0, 1, 0);
ledBoard.setDate(nullDate);

ledBoard.sendScreen(screens.laserOperation());
//ledBoard.sendScreen(screens.laserFinished(1000));
