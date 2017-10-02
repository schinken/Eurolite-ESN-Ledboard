'use strict';

const Commands = require('../LedBoard/Commands');

module.exports = (duration) => {
    let cmd = "";

    cmd += Commands.Control.PATTERN_IN + Commands.Pattern.SCROLL_UP;
    cmd += Commands.Control.PATTERN_OUT + Commands.Pattern.SCROLL_UP;

    if (duration > 10 * 60) {
        cmd += Commands.Font.NORMAL_14x8;
        cmd += Commands.Control.FONT_COLOR + Commands.FontColor.GREEN;

        // Blinkin' for the poor (because FLASH seems buggy)
        for (let i = 0; i < 3; i++) {
            cmd += 'Congratulations!';
            cmd += Commands.Pause.MILLISECOND_4 + '0400';
            cmd += Commands.Control.FRAME;
            cmd += ' ';
            cmd += Commands.Pause.MILLISECOND_4 + '0100';
            cmd += Commands.Control.FRAME;
        }
    }

    cmd += Commands.Control.PATTERN_IN + Commands.Pattern.PEEL_OFF_R;

    cmd += Commands.Font.NORMAL_7x6;
    cmd += Commands.Control.FONT_COLOR + Commands.FontColor.GREEN;
    cmd += Commands.Control.FLASH + Commands.Flash.OFF;

    cmd += 'Laser-Job finished:';

    cmd += Commands.Control.LINE_FEED;
    cmd += Commands.Control.FONT_COLOR + Commands.FontColor.RED;

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

    cmd += Commands.Pause.SECOND_4 + '0120';

    return cmd;
};