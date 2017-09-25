'use strict';

const Commands = require('../LedBoard/Commands');

module.exports = (nickname) => {
    let cmd = '';

    cmd += Commands.Control.PATTERN_IN + Commands.Pattern.RADAR_SCAN;

    [Commands.FontColor.GREEN, Commands.FontColor.RED, Commands.FontColor.YGR_HORIZONTAL].forEach((color) => {
        cmd += Commands.Font.NORMAL_7x6;
        cmd += Commands.Control.FONT_COLOR + color;
        cmd += 'Herzlich Willkommen im backspace!';
        cmd += Commands.Pause.SECOND_2 + '01';
        cmd += Commands.Control.FRAME;
    });

    cmd += Commands.Font.NORMAL_16x9;
    cmd += Commands.Control.FONT_COLOR + Commands.FontColor.YELLOW;
    cmd += Commands.Control.PATTERN_IN + Commands.Pattern.MOVE_UP;
    cmd += Commands.Control.PATTERN_OUT + Commands.Pattern.MOVE_LEFT;
    cmd += nickname;
    cmd += Commands.Pause.SECOND_2 + '30';

    return cmd;
};