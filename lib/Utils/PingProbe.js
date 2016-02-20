var events = require('events');
var ping = require('ping');
var util = require('util');
var ms = require('ms');

const MINIMUM_CONSECUTIVE_PINGS = 3;

function PingProbe(host, intervalMs) {
    this.host = host;
    this.alive = false;
    this.hostAliveCount = 0;
    this.probeInterval = intervalMs || ms('10s');

    this.setupProbe();
}

util.inherits(PingProbe, events.EventEmitter);

PingProbe.prototype.isAlive = function () {
    return this.alive;
};

PingProbe.prototype.setupProbe = function () {

    var that = this;

    setInterval(function() {
        ping.sys.probe(that.host, function (alive) {

            if (alive) {
                if (!that.alive && that.hostAliveCount > MINIMUM_CONSECUTIVE_PINGS) {
                    that.alive = true;
                    that.emit('alive');
                }

                that.hostAliveCount = Math.min(100, that.hostAliveCount + 1);
            } else {
                that.alive = false;
                that.hostAliveCount = 0;

                that.emit('dead');
            }
        });

    }, this.probeInterval);
};

module.exports = PingProbe;