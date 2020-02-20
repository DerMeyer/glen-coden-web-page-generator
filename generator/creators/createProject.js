const path = require('path');
const fs = require('fs');
const generatorConfig = require('../generator-config');

function createProject(projectDir, targetDir) {
    const config = require(path.join(projectDir, 'config'));

    return new Promise(resolve => {
        let file = '';
        fs.writeFileSync(path.join(targetDir, '_Project.js'), file);
        resolve();
    });
}

module.exports = createProject;