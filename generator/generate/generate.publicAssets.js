const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const { deepCopyDirectory } = require('../../js/helpers');

function generatePublicAssets(projectDir, publicDir) {
    return new Promise(resolve => {
        rimraf(path.join(publicDir, '*'), () => {
            deepCopyDirectory(path.join(projectDir, 'static'), publicDir);
            const config = fs.readFileSync(path.join(projectDir, 'config.json'), 'utf-8');
            fs.writeFileSync(path.join(publicDir, 'config.json'), config);
            resolve();
        });
    });
}



module.exports = generatePublicAssets;