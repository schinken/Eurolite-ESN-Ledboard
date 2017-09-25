'use strict';

const Commands = require('../LedBoard/Commands');

module.exports = (memberCount) => {
    let cmd = '';

    cmd += Commands.Font.NORMAL_7x6;
    cmd += Commands.Control.PATTERN_IN + Commands.Pattern.SCROLL_UP;
    cmd += Commands.Control.PATTERN_OUT + Commands.Pattern.SCROLL_UP;

    cmd += Commands.Control.FONT_COLOR + Commands.FontColor.GREEN;

    cmd += Commands.Control.SPECIAL + Commands.Special.YYYY + '-';
    cmd += Commands.Control.SPECIAL + Commands.Special.MM + '-';
    cmd += Commands.Control.SPECIAL + Commands.Special.DD + ' ';

    cmd += Commands.Control.FONT_COLOR + Commands.FontColor.RED;

    cmd += Commands.Control.SPECIAL + Commands.Special.HH + ':';
    cmd += Commands.Control.SPECIAL + Commands.Special.MIN + ':';
    cmd += Commands.Control.SPECIAL + Commands.Special.SEC;

    cmd += Commands.Control.LINE_FEED;

    cmd += Commands.Control.FONT_COLOR + Commands.FontColor.YELLOW;
    cmd += 'members present: ' + memberCount;
    cmd += Commands.Pause.SECOND_4 + '9999';

    return cmd;
};