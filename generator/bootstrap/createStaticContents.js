const path = require('path');
const fs = require('fs');

const bootstrapConfig = require('../bootstrap-config');

function createStaticContents(projectDir, bootstrapDir) {
    return new Promise(resolve => {
        const staticDir = path.join(projectDir, 'static');
        fs.mkdirSync(staticDir);
        createFileTree(bootstrapConfig.staticDir, staticDir, bootstrapDir);
        resolve();
    });
}

function createFileTree(config, targetDir, bootstrapDir) {
    config.forEach(entry => {
        const targetPath = path.join(targetDir, entry.name);
        if (entry.type === 'directory') {
            fs.mkdirSync(targetPath);
            if (entry.children) {
                createFileTree(entry.children, targetPath, bootstrapDir);
            }
        } else if (entry.type === 'file') {
            const file = fs.readFileSync(path.join(bootstrapDir, 'files', entry.name));
            fs.writeFileSync(targetPath, file);
        }
    });
}

module.exports = createStaticContents;