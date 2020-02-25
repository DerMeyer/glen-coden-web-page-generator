const path = require('path');
const fs = require('fs');

const CONFIG = require('../bootstrap-config');

function bootstrapFileTree(projectDir, bootstrapDir) {
    return new Promise(resolve => {
        createFromConfig(CONFIG.fileTree, projectDir, bootstrapDir);
        resolve();
    });
}

function createFromConfig(config, targetDir, bootstrapDir) {
    config.forEach(entry => {
        const targetPath = path.join(targetDir, entry.name);
        if (entry.type === 'directory') {
            fs.mkdirSync(targetPath);
            if (entry.children) {
                createFromConfig(entry.children, targetPath, bootstrapDir);
            }
        } else if (entry.type === 'file') {
            const file = fs.readFileSync(path.join(bootstrapDir, 'files', entry.name));
            fs.writeFileSync(targetPath, file);
        }
    });
}

module.exports = bootstrapFileTree;