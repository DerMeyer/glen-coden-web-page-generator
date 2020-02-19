const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const generatorConfig = require('../generator-config');

function copyStaticToPublic(staticPath, publicPath) {
    return new Promise(resolve => {
        rimraf(path.join(publicPath, '*'), () => {
            deepCopyDirectory(staticPath, publicPath);
            resolve();
        });
    });
}

function deepCopyDirectory(dirPath, targetPath) {
    const entryList = fs.readdirSync(dirPath).filter(entry => !generatorConfig.ignore.includes(entry));
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

module.exports = copyStaticToPublic;