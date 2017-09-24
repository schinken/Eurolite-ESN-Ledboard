'use strict';

const Commands = require('../LedBoard/Commands');

module.exports = (duration) => {
    let cmd = "";

    cmd += Commands.Font.NORMAL_7x6;
    cmd += Commands.Control.PATTERN_IN + Commands.Pattern.SCROLL_UP;
    cmd += Commands.Control.PATTERN_OUT + Commands.Pattern.SCROLL_UP;

    cmd += Commands.Control.FONT_COLOR + Commands.FontColor.GREEN;

    cmd += 'Laser-Job finished:';

    cmd += Commands.Control.LINE_FEED;

    cmd += Commands.Control.FONT_COLOR + Commands.FontColor.YELLOW;

    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor(duration % 60);

    if (hours) {
        cmd += hours + 'h ';
    }

    if (minutes) {
        cmd += minutes + 'm ';
    }

    if (seconds) {
        cmd += seconds + 's';
    }

    cmd += Commands.Pause.SECOND_2 + "30";

    return cmd;
};