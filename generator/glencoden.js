const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const { PROJECTS_PATH_SEGMENTS } = require('../confidential');

const SupportedCmds = {
    __BOOTSTRAP: '--bootstrap',
    __UPDATE: '--update',
    __GENERATE: '--generate',
    __OPTIMIZE: '--optimize'
};

const userCmds = process.argv.filter(cmd => Object.values(SupportedCmds).includes(cmd));
const argv = process.argv.filter(cmd => !Object.values(SupportedCmds).includes(cmd));

if (argv.length !== 2 && argv.length !== 3) {
    console.warn(`\nCouldn't understand arguments passed to glencoden command. Please read the documentation.\n`);
    process.exit();
}

const projectsDir = path.resolve( ...PROJECTS_PATH_SEGMENTS);
const projectName = argv[2];

if (userCmds.length === 0) {
    if (projectName && !fs.existsSync(path.resolve(projectsDir, projectName))) {
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
    .then(userCmds.includes(SupportedCmds.__GENERATE) ? () => execProcess(`yarn generate ${projectName}`) : Promise.resolve())
    .then(userCmds.includes(SupportedCmds.__OPTIMIZE) ? () => execProcess(`yarn optimize ${projectName}`) : Promise.resolve())
    .catch(console.error);
