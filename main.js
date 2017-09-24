'use strict';

const configuration = require('./lib/configuration');
const argv = require('yargs')
    .usage('Usage: $0 --config config')
    .demand(['config'])
    .argv;

const config = configuration.get(argv.config);

let runtime = null;
if (config.mode == 'default') {
    runtime = require('./default');
} else if (config.mode == 'lasercutter') {
    runtime = require('./lasercutter');
} else {
    process.exit(1);
}

runtime.run(config);