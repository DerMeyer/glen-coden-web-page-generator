const path = require('path');
const fs = require('fs');

function generateAppConfig(projectDir, targetDir) {
    const PROJECT_CONFIG = require(path.join(projectDir, 'config'));
    return new Promise(resolve => {
        fs.writeFileSync(path.join(targetDir, 'app-config.json'), JSON.stringify(PROJECT_CONFIG.app, null, 4));
        resolve();
    });
}

module.exports = generateAppConfig;