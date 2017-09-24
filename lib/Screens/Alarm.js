'use strict';

const Commands = require('../LedBoard/Commands');
const Common = require('../Utils/Common.js');

module.exports = (message) => {
    let cmd = '';

    cmd += Commands.Control.PATTERN_IN + Commands.Pattern.RADAR_SCAN;

    cmd += Commands.Font.NORMAL_16x9;
    cmd += Commands.Control.FLASH + Commands.Flash.ON;
    cmd += Commands.Control.FONT_COLOR + Commands.FontColor.RED;
    cmd += "!    ALARM    !";
    cmd += Commands.Control.FLASH + Commands.Flash.OFF;
    cmd += Commands.Pause.SECOND_2 + "04";

    cmd += Commands.Control.FRAME;

    cmd += Commands.Font.NORMAL_7x6;
    cmd += Commands.Control.FONT_COLOR + Commands.FontColor.GREEN;
    cmd += Commands.Control.PATTERN_IN + Commands.Pattern.MOVE_UP;
    cmd += Commands.Control.PATTERN_OUT + Commands.Pattern.MOVE_LEFT;
    cmd += Common.sanitizeUmlauts(message);
    cmd += Commands.Pause.SECOND_2 + "30";

    return cmd;
};