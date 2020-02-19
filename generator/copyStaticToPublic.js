const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const generatorConfig = require('./generator-config');

function copyStaticToPublic(staticPath, publicPath) {
    return new Promise(resolve => {
        console.log('\nCopy static assets into public directory...\n');
        rimraf(path.join(publicPath, '*'), () => {
            deepCopyDirectory(staticPath, publicPath);
            console.log('\nDone.\n');
            resolve();
        });
    });
}

function deepCopyDirectory(dirPath, targetPath) {
    console.log(`Copy ${dirPath}\nInto ${targetPath}`);
    const entryList = fs.readdirSync(dirPath).filter(entry => !generatorConfig.ignore.includes(entry));
    entryList.forEach(entry => {
        const entryPath = path.join(dirPath, entry);
        if (fs.statSync(entryPath).isDirectory()) {
            const targetDirectory = path.join(targetPath, entry);
            if (!fs.existsSync(targetDirectory)) {
                fs.mkdirSync(targetDirectory);
            }
            deepCopyDirectory(entryPath, targetDirectory);
            return;
        }
        const file = fs.readFileSync(entryPath);
        fs.writeFileSync(path.join(targetPath, entry), file);
    });
}

module.exports = copyStaticToPublic;