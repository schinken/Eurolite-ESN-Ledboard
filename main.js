var dgram = require('dgram');
var client = dgram.createSocket("udp4");

var Commands = require('./Commands');
var Udpio = require('./Udpio');

var StatusAPI = require('bckspc-status');

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
  cmd = ""

  cmd += "\x1a1";
  cmd += Commands.Control.PATTERN_IN + Commands.Pattern.SCROLL_UP;
  cmd += Commands.Control.PATTERN_OUT + Commands.Pattern.SCROLL_UP;

  cmd += Commands.Control.FONT_COLOR + Commands.FontColor.YELLOW;
  cmd += "Welcome, " + memberName;

  cmd += Commands.Pause.SECOND_2 + "20";

  return cmd;
}


function sendMessage(body, drive, filename) {

  var boardStr = buildPackage(body, drive, filename);
  console.log(body);
  var message = new Buffer(boardStr);

  client.send(message, 0, message.length, 9520, LEDBOARD_ADDR, function(err, bytes) {
    console.log(err, bytes);
  });
}
   
var lastMemberCount = 0;

function updateStandByMessage(numPresentMembers) {
  var standBy = standByMessage(numPresentMembers);
  sendMessage(standBy);
}

function switchBackToStandByAfter(seconds) {
  setTimeout(function() {
    updateStandByMessage(lastMemberCount);
  }, seconds*1000);
}

var status_api = new StatusAPI(STATUS_API, 120);

status_api.on('member_count', function(numPresentMembers) {
  lastMemberCount = numPresentMembers;
  updateStandByMessage(numPresentMembers);
});

status_api.on('member_joined', function(members) {

  var lastIndex = 0;
  var displayDurationSeconds = 20;

  members.forEach(function(member, index) {
    setTimeout(function() {
      welcomeMessage(member, displayDurationSeconds);
    }, displayDurationSeconds*index*1000);

    lastIndex = index;
  });

  switchBackToStandByMessage((lastIndex+1)*displayDurationSeconds);
});

var common_events = new Udpio('COMMON', 5042, '255.255.255.255');
common_events.on('irc_alarm', function(val) {
  var alarmStr = alarmMessage(val);
  sendMessage(alarmStr);

  switchBackToStandByMessage(30);
})

