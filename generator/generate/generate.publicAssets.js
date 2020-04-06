const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const GEN_CONFIG = require('../generator-config');

function generatePublicAssets(projectDir, publicDir) {
    return new Promise(resolve => {
        rimraf(path.join(publicDir, '*'), () => {
            deepCopyDirectory(path.join(projectDir, 'static'), publicDir);
            const config = fs.readFileSync(path.join(projectDir, 'config.json'), 'utf-8');
            fs.writeFileSync(path.join(publicDir, 'config.json'), config);
            resolve();
        });
    });
}

function deepCopyDirectory(dirPath, targetPath) {
    const entryList = fs.readdirSync(dirPath).filter(entry => !GEN_CONFIG.ignore.includes(entry));
    entryList.forEach(entry => {
        const entryPath = path.join(dirPath, entry);
        if (fs.statSync(entryPath).isDirectory()) {
            const targetDir = path.join(targetPath, entry);
            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir);
            }
            deepCopyDirectory(entryPath, targetDir);
            return;
        }
        const file = fs.readFileSync(entryPath);
        fs.writeFileSync(path.join(targetPath, entry), file);
    });
}

module.exports = generatePublicAssets;