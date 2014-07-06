var dgram = require('dgram');
var client = dgram.createSocket("udp4");

var Commands = require('./Commands');
var Udpio = require('./Udpio');

var StatusAPI = require('bckspc-status');
var ping = require('ping');

var STATUS_API = 'http://status.bckspc.de/status.php?response=json';
var LEDBOARD_ADDR = '10.1.20.23';

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


function alarmMessage(str) {
   
  console.log("Sending alarm message: " + str);
  cmd  = ""
  cmd += Commands.Control.PATTERN_IN + Commands.Pattern.RADAR_SCAN;
  cmd += Commands.Pause.SECOND_2 + "04";

  cmd += "\x1a4";
  cmd += Commands.Control.FLASH + Commands.Flash.ON;
  cmd += Commands.Control.FONT_COLOR + Commands.FontColor.RED;
  cmd += "!    ALARM    !"
  cmd += Commands.Control.FRAME;
  cmd += Commands.Control.FLASH + Commands.Flash.OFF;

  cmd += "\x1a1";
  cmd += Commands.Control.FONT_COLOR + Commands.FontColor.GREEN;
  cmd += Commands.Control.PATTERN_IN + Commands.Pattern.MOVE_UP;
  cmd += Commands.Control.PATTERN_OUT + Commands.Pattern.MOVE_LEFT;
  cmd += Commands.Pause.SECOND_2 + "08";

  cmd += str

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

function welcomeMessage(memberName) {

  console.log("Sending welcome message for user " + memberName);

  cmd = ""

  cmd += "\x1a1";
  cmd += Commands.Control.PATTERN_IN + Commands.Pattern.SCROLL_UP;
  cmd += Commands.Control.PATTERN_OUT + Commands.Pattern.SCROLL_UP;

  cmd += Commands.Control.FONT_COLOR + Commands.FontColor.YELLOW;
  cmd += "Welcome, " + memberName;

  cmd += Commands.Pause.SECOND_2 + "20";

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

  cmd += Commands.Pause.SECOND_2 + "20";

  return cmd;
}


function sendMessage(body, drive, filename) {

  var boardStr = buildPackage(body, drive, filename);
  var message = new Buffer(boardStr);

  console.log("SEND:" ,message);

  client.send(message, 0, message.length, 9520, LEDBOARD_ADDR, function(err, bytes) {
    console.log("SENT: ", err, bytes);
  });
}
   
var lastMemberCount = 0;
var lastRestore = null;

function switchBackToStandBy(seconds) {

  if(lastRestore !== null) {
    console.log("Clearing unprocessed stand by restore");
    clearInterval(lastRestore);
    lastRestore = null;
  }

  console.log("Add delayed stand by store after " + seconds + " seconds");
  lastRestore = setTimeout(function() {
    var standBy = standByMessage(lastMemberCount);
    sendMessage(standBy);
  }, seconds*1000);
}

var status_api = new StatusAPI(STATUS_API, 120);

status_api.on('member_count', function(numPresentMembers) {
  console.log("Member count changed to " + numPresentMembers);
  lastMemberCount = numPresentMembers;
  switchBackToStandBy(1);
});

status_api.on('member_joined', function(members) {

  var lastIndex = 0;
  var displayDurationSeconds = 20;

  members.forEach(function(member, index) {

    console.log("New member " + member + " joined");

    setTimeout(function() {
      var msg = welcomeMessage(member, displayDurationSeconds);
      sendMessage(msg);
    }, displayDurationSeconds*index*1000);

    lastIndex = index;
  });

  switchBackToStandBy((lastIndex+1)*displayDurationSeconds);
});

var common_events = new Udpio('COMMON', 5042, '255.255.255.255');
common_events.on('irc_alarm', function(val) {

  console.log("Incoming alarm message, "+val);

  var alarmStr = alarmMessage(val);
  sendMessage(alarmStr);

  switchBackToStandBy(30);
});

common_events.on('pizza_timer', function() {
  console.log("Pizza event received");

  var pizzaStr = pizzaMessage();
  sendMessage(pizzaStr);

  switchBackToStandBy(22);
});

// Check if host comes back, and set new standbymessage

var hostAvailable = false;
var hostAvailableCount = 10;

setInterval(function() {
   ping.sys.probe(LEDBOARD_ADDR, function(isAlive) {


     if(isAlive) {
       console.log("Ledboard responds to pings");
     } else {
       console.log("Ledboard does not responds to pings");
     }

     if(isAlive) {

       if(hostAvailableCount > 2 && hostAvailable == false) {
          hostAvailable = true;
          console.log("Restoring stand by message with last member count, " +lastMemberCount);
          switchBackToStandBy(1);
       }

       hostAvailableCount = Math.min(100, hostAvailableCount+1);
    } else {
      hostAvailable = false;
      hostAvailableCount = 0;
    }

   });

}, 10*1000);
