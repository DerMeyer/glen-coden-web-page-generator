const { exec } = require('child_process');

const projectName = process.argv[2];

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
    .then(() => execProcess(`yarn bootstrap ${projectName}`))
    .then(() => execProcess(`yarn update ${projectName}`))
    .then(() => execProcess(`yarn generate ${projectName}`))
    .then(() => execProcess('yarn start'))
    .catch(console.error);
