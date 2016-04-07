var Commands = require('../LedBoard/Commands');

module.exports = function (memberCount) {
    var cmd = "";

    cmd += Commands.Font.NORMAL_7x6;
    cmd += Commands.Control.PATTERN_IN + Commands.Pattern.SCROLL_UP;
    cmd += Commands.Control.PATTERN_OUT + Commands.Pattern.SCROLL_UP;

    cmd += Commands.Control.FONT_COLOR + Commands.FontColor.GREEN;
    cmd += "\x0B\x26-\x0B\x27-\x0B\x29";

    cmd += Commands.Control.FONT_COLOR + Commands.FontColor.RED;
    cmd += " \x0B\x2C:\x0B\x2D:\x0B\x2E";

    cmd += Commands.Control.LINE_FEED;

    cmd += Commands.Control.FONT_COLOR + Commands.FontColor.YELLOW;
    cmd += "members present: " + memberCount;
    cmd += Commands.Pause.SECOND_4 + "9999";

    return cmd;
};