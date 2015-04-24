var dgram = require('dgram');
var client = dgram.createSocket("udp4");

var Commands = require('./Commands');
var settings = require('./settings');

var StatusAPI = require('bckspc-status');
var ping = require('ping');
var mqtt = require('mqtt');

var mqttClient = mqtt.createClient(settings.mqtt.port, settings.mqtt.host);

mqttClient.subscribe('psa/alarm');
mqttClient.subscribe('psa/donation');
mqttClient.subscribe('psa/pizza');
mqttClient.subscribe('psa/newMember');
mqttClient.subscribe('psa/message');
mqttClient.subscribe('sensor/door/bell');

var lastMemberCount = 0;

function buildPackage(msg, drive, filename) {

  str  = "";
  str += Commands.Control.HEAD;

  str = "\x01Z00\x02A";
  // store to RAM
  str += "\x0fETAA";

  str += msg;
  str += Commands.Control.END;

  return str;
}

var UMLAUTS = { 'ä': 'ae', 'ü': 'ue', 'ö': 'oe', 'ß': 'sz' };

function convertUmlauts(message) {
  Object.keys(UMLAUTS).forEach(function(key) {
    message = message.replace(key, UMLAUTS[key]);
  });

  return message;
}


function alarmMessage(str) {
   
  console.log("Sending alarm message: " + str);
  cmd  = ""
  cmd += Commands.Control.PATTERN_IN + Commands.Pattern.RADAR_SCAN;

  cmd += "\x1a4";
  cmd += Commands.Control.FLASH + Commands.Flash.ON;
  cmd += Commands.Control.FONT_COLOR + Commands.FontColor.RED;
  cmd += "!    ALARM    !"
  cmd += Commands.Control.FLASH + Commands.Flash.OFF;
  cmd += Commands.Pause.SECOND_2 + "04";

  cmd += Commands.Control.FRAME;

  cmd += "\x1a1";
  cmd += Commands.Control.FONT_COLOR + Commands.FontColor.GREEN;
  cmd += Commands.Control.PATTERN_IN + Commands.Pattern.MOVE_UP;
  cmd += Commands.Control.PATTERN_OUT + Commands.Pattern.MOVE_LEFT;
  cmd += convertUmlauts(str);
  cmd += Commands.Pause.SECOND_2 + "10";

  return cmd
}

function psaMessage(message) {
  console.log("Reciving PSA message " + message);

  cmd = "";
  cmd += Commands.Control.PATTERN_IN + Commands.Pattern.RADAR_SCAN;
  cmd += Commands.Control.FLASH + Commands.Flash.ON;

  cmd += "\x1a1";

  cmd += Commands.Control.FONT_COLOR + Commands.FontColor.YELLOW;
  cmd += "PUBLIC ";

  cmd += Commands.Control.FONT_COLOR + Commands.FontColor.RED;
  cmd += "SERVICE ";

  cmd += Commands.Control.FONT_COLOR + Commands.FontColor.GREEN;
  cmd += "ANNOUNCEMENT";

  cmd += Commands.Control.FLASH + Commands.Flash.OFF;

  cmd += Commands.Pause.SECOND_2 + "05";
  cmd += Commands.Control.FRAME;

  cmd += convertUmlauts(message);
  cmd += Commands.Pause.SECOND_2 + "30";

  return cmd;
}

function newMemberMessage(nickname) {
   
  console.log("Sending new member message: " + nickname);
  cmd  = ""
  cmd += Commands.Control.PATTERN_IN + Commands.Pattern.RADAR_SCAN;
                                                               
  [Commands.FontColor.GREEN, Commands.FontColor.RED, Commands.FontColor.YGR_HORIZONTAL].forEach(function(color) {
    cmd += "\x1a1";
    cmd += Commands.Control.FONT_COLOR + color;
    cmd += "Herzlich Willkommen im backspace!"
    cmd += Commands.Pause.SECOND_2 + "01";
    cmd += Commands.Control.FRAME;
  });

  cmd += "\x1a4";
  cmd += Commands.Control.FONT_COLOR + Commands.FontColor.YELLOW;
  cmd += Commands.Control.PATTERN_IN + Commands.Pattern.MOVE_UP;
  cmd += Commands.Control.PATTERN_OUT + Commands.Pattern.MOVE_LEFT;
  cmd += nickname;
  cmd += Commands.Pause.SECOND_2 + "15";

  return cmd
}

function standByMessage(presentMembers) {

  console.log("Sending stand by message with " + presentMembers + " members present ");
  cmd = ""

  cmd += "\x1a1";
  cmd += Commands.Control.PATTERN_IN + Commands.Pattern.SCROLL_UP;
  cmd += Commands.Control.PATTERN_OUT + Commands.Pattern.SCROLL_UP;

  cmd += Commands.Control.FONT_COLOR + Commands.FontColor.GREEN;
  cmd += "\x0B\x26-\x0B\x27-\x0B\x29"

  cmd += Commands.Control.FONT_COLOR + Commands.FontColor.RED;
  cmd += " \x0B\x2C:\x0B\x2D:\x0B\x2E"

  cmd += Commands.Control.LINE_FEED;

  cmd += Commands.Control.FONT_COLOR + Commands.FontColor.YELLOW;
  cmd += "members " + presentMembers;
  cmd += Commands.Pause.SECOND_4 + "9999";

  return cmd;
}

function doorBellMessage() {

  console.log("Sending door bell message");

  cmd  = ""
  cmd += Commands.Control.PATTERN_IN + Commands.Pattern.SCROLL_UP;
  cmd += Commands.Control.PATTERN_OUT + Commands.Pattern.SCROLL_UP;

  cmd += "\x1a4";                        
  cmd += Commands.Control.FLASH + Commands.Flash.ON;
  cmd += Commands.Control.FONT_COLOR + Commands.FontColor.RED;
  cmd += "!    DOORBELL    !"
  cmd += Commands.Control.FLASH + Commands.Flash.OFF;
  cmd += Commands.Pause.SECOND_2 + "10";

  return cmd;
}

function pizzaMessage() {

  console.log("Sending pizza ready message");

  cmd = ""

  cmd += "\x1a4";
  cmd += Commands.Control.PATTERN_IN + Commands.Pattern.SCROLL_UP;
  cmd += Commands.Control.PATTERN_OUT + Commands.Pattern.SCROLL_UP;

  cmd += Commands.Control.FLASH + Commands.Flash.ON;
  cmd += Commands.Control.FONT_COLOR + Commands.FontColor.YGR_CHARACTER;
  cmd += "PIZZA IS READY!";

  cmd += Commands.Control.FLASH + Commands.Flash.OFF;

  cmd += Commands.Pause.SECOND_2 + "10";

  return cmd;
}

function donationMessage() {

  console.log("Sending donation message");

  cmd = ""

  cmd += "\x1a4";
  cmd += Commands.Control.PATTERN_IN + Commands.Pattern.SCROLL_UP;
  cmd += Commands.Control.PATTERN_OUT + Commands.Pattern.SCROLL_UP;

  cmd += Commands.Control.FLASH + Commands.Flash.ON;
  cmd += Commands.Control.FONT_COLOR + Commands.FontColor.YGR_CHARACTER;
  cmd += "\\o/ Spende! \\o/";

  cmd += Commands.Control.FLASH + Commands.Flash.OFF;

  cmd += Commands.Pause.SECOND_2 + "04";

  return cmd;
}



function sendMessage(body, drive, filename) {

  var boardStr = buildPackage(body, drive, filename);
  var message = new Buffer(boardStr);

  console.log("SEND:" ,message);

  client.send(message, 0, message.length, 9520, settings.ledboard.host, function(err, bytes) {
    console.log("SENT: ", err, bytes);
  });
}

var status_api = new StatusAPI(settings.status.url, settings.status.interval);

status_api.on('member_count', function(numPresentMembers) {

  console.log("Member count changed to " + numPresentMembers);
  lastMemberCount = numPresentMembers;
  var message = standByMessage(lastMemberCount);
  sendMessage(message);
});

mqttClient.on('message', function(topic, val) {

  console.log("Received mqtt topic "+ topic +" with value '"+val+"'")
  switch(topic) {

    case 'psa/pizza':

      var message = pizzaMessage();
      message += Commands.Control.FRAME;
      message += standByMessage(lastMemberCount);
      sendMessage(message);

      break;

    case 'psa/donation':

      var message = donationMessage();
      message += Commands.Control.FRAME;
      message += standByMessage(lastMemberCount);
      sendMessage(message);

      break;

    case 'psa/alarm':

      var message = alarmMessage(val);
      message += Commands.Control.FRAME;
      message += standByMessage(lastMemberCount);
      sendMessage(message);

      break;

    case 'psa/newMember':
      var message = newMemberMessage(val);
      message += Commands.Control.FRAME;
      message += standByMessage(lastMemberCount);
      sendMessage(message);

      break;


    case 'sensor/door/bell':

      if(val) {
        var message = doorBellMessage();
        message += Commands.Control.FRAME;
        message += standByMessage(lastMemberCount);
        sendMessage(message);
      }

      break;

    case 'psa/message':

      if(val) {
        var message = psaMessage(val);
        message += Commands.Control.FRAME;
        message += standByMessage(lastMemberCount);
        sendMessage(message);
      }

      break;
  }
});

// Check if host comes back, and set new standbymessage

var hostAvailable = false;
var hostAvailableCount = 10;

setInterval(function() {

   ping.sys.probe(settings.ledboard.host, function(isAlive) {

     if(isAlive) {

       if(hostAvailableCount > 3 && hostAvailable == false) {
          hostAvailable = true;
          console.log("Restoring stand by message with last member count, " +lastMemberCount);
          var message = standByMessage(lastMemberCount);
          sendMessage(message);
       }

       hostAvailableCount = Math.min(100, hostAvailableCount+1);
    } else {
      hostAvailable = false;
      hostAvailableCount = 0;
    }

   });

}, 10*1000);

