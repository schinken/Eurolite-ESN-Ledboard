'use strict';

const EventEmitter = require('events');
const events = require('events');
const ping = require('ping');
const ms = require('ms');

class PingProbe extends EventEmitter {

    constructor(host, config) {
        super();

        this.host = host;
        this.alive = false;
        this.hostAliveCount = 0;

        this.consecutiveAnswers = config.consecutiveAnswers || 3;
        this.probeInterval = config.interval || ms('10s');

        this.setupProbe();
    }

    isAlive() {
        return this.alive;
    }

    setupProbe() {
        setInterval(() => {
            ping.sys.probe(this.host, (alive) => {

                if (alive) {
                    if (!this.alive && this.hostAliveCount > this.consecutiveAnswers) {
                        this.alive = true;
                        this.emit('alive');
                    }

                    this.hostAliveCount = Math.min(100, this.hostAliveCount + 1);
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