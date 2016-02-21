var Commands = require('../LedBoard/Commands');
var commonUtils = require('../Utils/Common.js');

module.exports = function (message) {
    var cmd = "";

    cmd += Commands.Control.PATTERN_IN + Commands.Pattern.RADAR_SCAN;

    cmd += "\x1a4";
    cmd += Commands.Control.FLASH + Commands.Flash.ON;
    cmd += Commands.Control.FONT_COLOR + Commands.FontColor.RED;
    cmd += "!    ALARM    !";
    cmd += Commands.Control.FLASH + Commands.Flash.OFF;
    cmd += Commands.Pause.SECOND_2 + "04";

    cmd += Commands.Control.FRAME;

    cmd += "\x1a1";
    cmd += Commands.Control.FONT_COLOR + Commands.FontColor.GREEN;
    cmd += Commands.Control.PATTERN_IN + Commands.Pattern.MOVE_UP;
    cmd += Commands.Control.PATTERN_OUT + Commands.Pattern.MOVE_LEFT;
    cmd += commonUtils.sanitizeUmlauts(message);
    cmd += Commands.Pause.SECOND_2 + "30";

    return cmd;
};