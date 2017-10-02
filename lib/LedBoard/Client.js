'use strict';

const dgram = require('dgram');
const UdpClient = dgram.createSocket("udp4");

const Common = require('../Utils/Common');
const Commands = require('./Commands');

class Client {

    constructor(host, port) {
        this.host = host;
        this.port = port || 9520;
    }

    send(datagram) {
        const message = new Buffer(datagram);

        UdpClient.send(message, 0, message.length, this.port, this.host, (error, bytes) => {
            if (error) {
                return console.error('Failed sending UDP message');
            }
        });
    }

    setDate(date) {
        let cmd = Commands.Control.HEAD;

        cmd = "\x01Z00\x02E";
        cmd += "B";

        cmd += Common.byte2hex(date.getFullYear() % 100) + Common.byte2hex(Math.floor(date.getFullYear() / 100));
        cmd += Common.byte2hex(date.getMonth() + 1);
        cmd += Common.byte2hex(date.getDate());
        cmd += Common.byte2hex(date.getHours());
        cmd += Common.byte2hex(date.getMinutes());
        cmd += Common.byte2hex(date.getDay());

        const offsetHours = Math.abs(Math.floor(date.getTimezoneOffset() / 60));
        // Add +12, because TZ-12 = 0x00
        cmd += Common.byte2hex(offsetHours + 12);

        cmd += Commands.Control.END;

        this.send(cmd);
    }

    sendScreen(screen) {
        const datagram = this.__buildDatagram(screen);
        this.send(datagram);
    }

    sendScreens(screens) {
        this.sendScreen(screens.join(Commands.Control.FRAME));
    }

    __buildDatagram(screen) {

        let cmd = "";
        cmd += Commands.Control.HEAD;

        cmd = "\x01Z00\x02A";
        cmd += "\x0fETAA"; // store to RAM

        cmd += screen;
        cmd += Commands.Control.END;

        return cmd;
    };

}

module.exports = Client;