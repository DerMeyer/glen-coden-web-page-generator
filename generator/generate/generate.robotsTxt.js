const path = require('path');
const fs = require('fs');
const GEN_CONFIG = require('../generator-config');

function generateRobotsTxt(targetDir) {
    return new Promise(resolve => {
        fs.writeFileSync(path.join(targetDir, 'robots.txt'), GEN_CONFIG.robotsTxt);
        resolve();
    });
}

module.exports = generateRobotsTxt;