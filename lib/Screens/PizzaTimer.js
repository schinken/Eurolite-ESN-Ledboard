'use strict';

const Commands = require('../LedBoard/Commands');

module.exports = () => {
    var cmd = "";

    cmd += Commands.Font.NORMAL_16x9;
    cmd += Commands.Control.PATTERN_IN + Commands.Pattern.SCROLL_UP;
    cmd += Commands.Control.PATTERN_OUT + Commands.Pattern.SCROLL_UP;

    cmd += Commands.Control.FLASH + Commands.Flash.ON;
    cmd += Commands.Control.FONT_COLOR + Commands.FontColor.YGR_CHARACTER;
    cmd += "PIZZA IS READY!";

    cmd += Commands.Control.FLASH + Commands.Flash.OFF;

    cmd += Commands.Pause.SECOND_2 + "10";

    return cmd;
};