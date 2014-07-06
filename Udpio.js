var events = require('events')
   ,dgram = require('dgram')
   ,util = require('util');

var INIT_ID_UNAVAILABLE = -1;
var INIT_TOKEN = 'init';

var UDPIO = function(namespace, port, ip) {

    this.reMessage = new RegExp(namespace+",(\\d+),(\\w+),(.*)$", 'i');

    this.ip = ip;
    this.port = port || 5042;
    this.namespace = namespace;

    this.initId = INIT_ID_UNAVAILABLE;

    var udp_client = dgram.createSocket('udp4');
    udp_client.bind(this.port, this.ip, function() {
        udp_client.setBroadcast(true);    
    });

    this.udp_client = udp_client;

    this.setup();

};

util.inherits(UDPIO, events.EventEmitter);

UDPIO.prototype.setup = function() {
    var that = this;
    this.udp_client.on('message', function(msg) {
       console.log(msg);

        var m = msg.toString().match(that.reMessage);
        if(m && (m[1] == 0 || m[1] == that.initId)) {
            this.initId = INIT_ID_UNAVAILABLE;

            var key = m[2];
            var val = m[3];

            // Check if value is number
            if(!isNaN(parseFloat(val)) && isFinite(val)) {
                if(val.indexOf('.') !== -1) {
                    val = parseFloat(val);
                } else {
                    val = parseInt(val, 10);
                }
            }    
            
            that.emit(key, val);
        }
    });
};


UDPIO.prototype.init = function() {
    this.initId = parseInt(Math.random()*10000, 10);
    var msg = new Buffer([this.namespace, this.initId, INIT_TOKEN, 1].join());
    this.udp_client.send(msg, 0, msg.length, this.port, this.ip);
};

module.exports = UDPIO;
