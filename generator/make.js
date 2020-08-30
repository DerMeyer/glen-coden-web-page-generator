const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const getPath = require('../js/getters/getPath');
const GEN_CONFIG = require('./generator-config');


const projectName = process.argv[2] || GEN_CONFIG._project;

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
    .then(
        !fs.existsSync(path.resolve(getPath.projectsDir, projectName))
            ? () => execProcess(`yarn bootstrap ${projectName}`)
            : Promise.resolve()
    )
    .then(() => execProcess(`yarn update ${projectName}`))
    .then(() => execProcess(`yarn generate ${projectName}`))
    .catch(console.error);
