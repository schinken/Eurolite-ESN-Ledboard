'use strict';

const Commands = require('../LedBoard/Commands');

module.exports = () => {
    let cmd = '';

    cmd += Commands.Control.PATTERN_IN + Commands.Pattern.RADAR_SCAN;

    cmd += Commands.Font.NORMAL_15x9;

    cmd += Commands.Control.SPECIAL + Commands.Special.HH + 'h ';
    cmd += Commands.Control.SPECIAL + Commands.Special.MIN + 'm ';
    cmd += Commands.Control.SPECIAL + Commands.Special.SEC + 's ';

    cmd += Commands.Pause.SECOND_4 + '9999';

    return cmd;
};