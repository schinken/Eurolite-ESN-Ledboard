'use strict';

const Commands = require('../LedBoard/Commands');
const commonUtils = require('../Utils/Common.js');

module.exports = (message) => {
    let cmd = '';

    cmd += Commands.Control.PATTERN_IN + Commands.Pattern.RADAR_SCAN;
    cmd += Commands.Control.FLASH + Commands.Flash.ON;

    cmd += Commands.Font.NORMAL_7x6;

    cmd += Commands.Control.FONT_COLOR + Commands.FontColor.YELLOW;
    cmd += 'PUBLIC ';

    cmd += Commands.Control.FONT_COLOR + Commands.FontColor.RED;
    cmd += 'SERVICE ';

    cmd += Commands.Control.FONT_COLOR + Commands.FontColor.GREEN;
    cmd += 'ANNOUNCEMENT';

    cmd += Commands.Control.FLASH + Commands.Flash.OFF;

    cmd += Commands.Pause.SECOND_2 + '05';
    cmd += Commands.Control.FRAME;

    cmd += commonUtils.sanitizeUmlauts(message);
    cmd += Commands.Pause.SECOND_2 + '45';

    return cmd;
};