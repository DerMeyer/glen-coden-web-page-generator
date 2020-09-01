const path = require('path');
const rimraf = require('rimraf');
const { deepCopyDirectory } = require('../../js/helpers');

function generatePublicAssets(projectDir, publicDir) {
    return new Promise(resolve => {
        rimraf(path.join(publicDir, '*'), () => {
            deepCopyDirectory(path.join(projectDir, 'static'), publicDir);
            resolve();
        });
    });
}



module.exports = generatePublicAssets;