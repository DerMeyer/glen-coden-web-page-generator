const chalk = require('chalk');
const { log } = console;


function print(string, first = false, last = false) {
    log(`${first ? '\n' : ''}\t${chalk.green(string)}${last ? '\n' : ''}`);
}
function warn(string, first = false, last = false) {
    log(`${first ? '\n' : ''}\t${chalk.red(string)}${last ? '\n' : ''}`);
}

function success(string) {
    log(`\n\t${chalk.green.bgGreen(`\t${string}\t\s`)}`);
    log(`\t${chalk.bgGreen(' ')}\t${chalk.blue(string)}\t${chalk.bgGreen(' ')}`);
    log(`\t${chalk.green.bgGreen(`\t${string}\t\s\n`)}`);
}
function error(string) {
    log(`\n\t${chalk.red.bgRed(`\t${string}\t\s`)}`);
    log(`\t${chalk.bgRed(' ')}\t${chalk.blue(string)}\t${chalk.bgRed(' ')}`);
    log(`\t${chalk.red.bgRed(`\t${string}\t\s\n`)}`);
}

exports.print = print;
exports.warn = warn;
exports.success = success;
exports.error = error;