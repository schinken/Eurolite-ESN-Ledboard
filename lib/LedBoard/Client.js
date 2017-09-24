var dgram = require('dgram');
var udpClient = dgram.createSocket("udp4");

var Commands = require('./Commands');

function Client(host, port) {
    this.host = host;
    this.port = port || 9520;
}

Client.prototype.send = function (datagram) {
    var message = new Buffer(datagram);

    udpClient.send(message, 0, message.length, this.port, this.host, function (error, bytes) {
        if(error) {
            return console.error('Failed sending UDP message');
        }
    });
};

Client.prototype.setDate = function (date) {
    var str = Commands.Control.HEAD;

    str = "\x01Z00\x02E";
    str += "B";

    str += Common.byte2hex(date.getFullYear() % 100) + Common.byte2hex(Math.floor(date.getFullYear() / 100));
    str += Common.byte2hex(date.getMonth() + 1);
    str += Common.byte2hex(date.getDate());
    str += Common.byte2hex(date.getHours());
    str += Common.byte2hex(date.getMinutes());
    str += Common.byte2hex(date.getDay());
    str += "\x01";

    str += Commands.Control.END;

    this.send(str);
};

Client.prototype.sendScreen = function (screen) {
    var datagram = this.__buildDatagram(screen);
    this.send(datagram);
};

Client.prototype.sendScreens = function (screens) {
    this.sendScreen(screens.join(Commands.Control.FRAME));
};

Client.prototype.__buildDatagram = function (screen) {

    var str = "";
    str += Commands.Control.HEAD;

    str = "\x01Z00\x02A";
    str += "\x0fETAA"; // store to RAM

    str += screen;
    str += Commands.Control.END;

    return str;
};

module.exports = Client;