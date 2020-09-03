const chalk = require('chalk');


function write(string) {
    console.log(chalk.green(string));
}

exports.write = write;