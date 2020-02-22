const path = require('path');
const fs = require('fs');

function copyAppConfig(projectDir, targetDir) {
    const config = require(path.join(projectDir, 'config'));
    return new Promise(resolve => {
        fs.writeFileSync(path.join(targetDir, '_app-config.json'), JSON.stringify(config.app, null, 4));
        resolve();
    });
}

module.exports = copyAppConfig;