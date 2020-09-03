const chalk = require('chalk');
const { log } = console;


function print(string, first = false, last = false) {
    log(`${first ? '\n' : ''}\t${string}${last ? '\n' : ''}`);
}

function warn(string, first = false, last = false) {
    log(`${first ? '\n' : ''}\t${chalk.red(string)}${last ? '\n' : ''}`);
}

function title(string) {
    log(`\n\t${chalk.blue(`----- ${string} -----`)}\n`);
}

function success(string) {
    log(`\n\t${chalk.green.bgGreen(`         ${string}         `)}`);
    log(`\t${chalk.bgGreen(' ')}${chalk.blue(`        ${string}        `)}${chalk.bgGreen(' ')}`);
    log(`\t${chalk.green.bgGreen(`         ${string}         `)}\n`);
}

function error(string) {
    log(`\n\t${chalk.red.bgRed(`         ${string}         `)}`);
    log(`\t${chalk.bgRed(' ')}${chalk.blue(`        ${string}        `)}${chalk.bgRed(' ')}`);
    log(`\t${chalk.red.bgRed(`         ${string}         `)}\n`);
}

function statusCode(string, status) {
    const stringColor = String(status).startsWith('2')
        ? chalk.green
        : chalk.red;
    const statusColor = String(status).startsWith('2')
        ? chalk.blue
        : chalk.red;
    log(`\n\t${stringColor(`${string}\tSTATUS CODE: `)}${statusColor(status)}\n`);
}

exports.print = print;
exports.warn = warn;
exports.title = title;
exports.success = success;
exports.error = error;
exports.statusCode = statusCode;