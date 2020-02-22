const path = require('path');
const fs = require('fs');

function copyProjectConfig(projectDir, targetDir) {
    const config = require(path.join(projectDir, 'config'));
    return new Promise(resolve => {
        fs.writeFileSync(path.join(targetDir, '_project-config.json'), JSON.stringify(config.project, null, 4));
        resolve();
    });
}

module.exports = copyProjectConfig;