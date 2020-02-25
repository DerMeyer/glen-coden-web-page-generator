const path = require('path');
const fs = require('fs');
const CONFIG = require('../generator-config');

function generateRobotsTxt(targetDir) {
    return new Promise(resolve => {
        fs.writeFileSync(path.join(targetDir, 'robots.txt'), CONFIG.robotsTxt);
        resolve();
    });
}

module.exports = generateRobotsTxt;