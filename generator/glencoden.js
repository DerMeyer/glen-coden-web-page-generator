const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const getPath = require('../js/getters/getPath');
const CONFIG = require('./generator-config');

const SupportedCmds = {
    __LIST: '--list',
    __BOOTSTRAP: '--bootstrap',
    __UPDATE: '--update',
    __OPTIMIZE: '--optimize',
    __GENERATE: '--generate'
};

const userCmds = process.argv.filter(cmd => cmd.startsWith('--'));
const argv = process.argv.filter(cmd => !cmd.startsWith('--'));

if (userCmds.some(cmd => !Object.values(SupportedCmds).includes(cmd))) {
    userCmds.forEach(cmd => {
        if (!Object.values(SupportedCmds).includes(cmd)) {
            console.warn(`\nUser command ${cmd} not supported.\n`);
        }
    });
    process.exit();
}

if (argv.length !== 2 && argv.length !== 3) {
    console.warn(`\nCouldn't read arguments passed to glencoden command. Please read the documentation in README.txt.\n`);
    process.exit();
}

if (userCmds.includes(SupportedCmds.__LIST)) {
    const projectList = fs.readdirSync(path.resolve(getPath.projectsDir)).filter(fileName => !CONFIG.ignore.includes(fileName));
    let list = '\n';
    projectList.forEach(name => list += `${name}${name === CONFIG._project ? '\t*' : ''}\n`);
    console.log(list);
}

const projectName = argv[2] || CONFIG._project;

if (userCmds.length === 0) {
    if (!fs.existsSync(path.resolve(getPath.projectsDir, projectName))) {
        userCmds.push(SupportedCmds.__BOOTSTRAP);
    }
    userCmds.push(SupportedCmds.__UPDATE);
    userCmds.push(SupportedCmds.__GENERATE);
}

function execProcess(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(`exec error for command ${command}: ${error}`);
            }
            if (stderr) {
                console.error(`stderr for command ${command}: ${stderr}`);
            }
            console.log(stdout);
            resolve();
        });
    });
}

Promise.resolve()
    .then(userCmds.includes(SupportedCmds.__BOOTSTRAP) ? () => execProcess(`yarn bootstrap ${projectName}`) : Promise.resolve())
    .then(userCmds.includes(SupportedCmds.__UPDATE) ? () => execProcess(`yarn update ${projectName}`) : Promise.resolve())
    .then(userCmds.includes(SupportedCmds.__OPTIMIZE) ? () => execProcess(`yarn optimize ${projectName}`) : Promise.resolve())
    .then(userCmds.includes(SupportedCmds.__GENERATE) ? () => execProcess(`yarn generate ${projectName}`) : Promise.resolve())
    .catch(console.error);
