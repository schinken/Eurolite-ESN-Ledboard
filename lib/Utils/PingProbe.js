const events = require('events');
const ping = require('ping');
const util = require('util');
const ms = require('ms');

const MINIMUM_CONSECUTIVE_PINGS = 3;

class PingProbe extends EventEmitter {

    constructor(host, intervalMs) {
        this.host = host;
        this.alive = false;
        this.hostAliveCount = 0;
        this.probeInterval = intervalMs || ms('10s');

        this.setupProbe();
    }

    isAlive() {
        return this.alive;
    }

    setupProbe() {
        setInterval(() => {
            ping.sys.probe(this.host, (alive) => {

                if (alive) {
                    if (!this.alive && this.hostAliveCount > MINIMUM_CONSECUTIVE_PINGS) {
                        this.alive = true;
                        this.emit('alive');
                    }

                    this.hostAliveCount = Math.min(100, that.hostAliveCount + 1);
                } else {
                    this.alive = false;
                    this.hostAliveCount = 0;

                    this.emit('dead');
                }
            });

        }, this.probeInterval);
    }
}

module.exports = PingProbe;