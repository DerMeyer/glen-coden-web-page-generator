const path = require('path');
const fs = require('fs');
const generatorConfig = require('../generator-config');

function createRobotsTxt(targetDir) {
    return new Promise(resolve => {
        fs.writeFileSync(path.join(targetDir, 'robots.txt'), generatorConfig.robotsTxt);
        resolve();
    });
}

module.exports = createRobotsTxt;