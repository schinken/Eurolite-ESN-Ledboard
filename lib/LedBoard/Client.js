var dgram = require('dgram');
var udpClient = dgram.createSocket("udp4");

var Commands = require('./Commands');

function Client(host, port) {
    this.host = host;
    this.port = port || 9520;
}

Client.prototype.sendScreen = function (screen) {
    var datagram = this.__buildDatagram(screen);
    var message = new Buffer(datagram);

    udpClient.send(message, 0, message.length, this.port, this.host, function (error, bytes) {
        if(error) {
            return console.error('Failed sending UDP message');
        }
    });
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