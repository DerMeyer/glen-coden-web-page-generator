const path = require('path');
const fs = require('fs');
const getPath = require('../js/getters/getPath');

const optimizeAssets = require('./optimize.assets');
const optimizeSingleAsset = require('./optimize.singleAsset');

const projectName = process.argv[2];
const imagePath = process.argv[3];

if (!projectName) {
    console.warn(`\nCouldn't optimize assets. Please pass a project name as first arg to the optimize command.\n`);
    process.exit();
}

const projectDir = path.join(getPath.projectsDir, projectName);

if (!fs.existsSync(projectDir)) {
    console.warn(`\nCouldn't find project in ${projectDir}.\n`);
    process.exit();
}

if (imagePath) {
    const filePath = path.join(projectDir, imagePath);
    if (!fs.existsSync(filePath)) {
        console.warn(`\nCouldn't find image in ${filePath}.\n`);
        process.exit();
    }
    Promise.resolve()
        .then(() => {
            console.log(`\nOptimize image in ${projectDir}.\n`);
            return optimizeSingleAsset(filePath);
        })
        .catch(console.error);
} else {
    Promise.resolve()
        .then(() => {
            console.log(`\nOptimize logos in ${projectDir}.\n`);
            return optimizeAssets(projectDir, 'logos');
        })
        .then(() => {
            console.log(`\nOptimize icons in ${projectDir}.\n`);
            return optimizeAssets(projectDir, 'icons');
        })
        .then(() => {
            console.log(`\nOptimize images in ${projectDir}.\n`);
            return optimizeAssets(projectDir, 'images');
        })
        .catch(console.error);
}
