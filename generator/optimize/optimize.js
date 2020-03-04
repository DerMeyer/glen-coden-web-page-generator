const path = require('path');
const fs = require('fs');
const getPath = require('../js/getters/getPath');
const CONFIG = require('../generator-config');

const optimizeImages = require('./optimize.images');

const projectName = process.argv[2];

if (!projectName) {
    console.warn(`\nCouldn't optimize assets. Please pass a project name as first arg to the bootstrap command.\n`);
    process.exit();
}

const projectDir = path.join(getPath.projectsDir, projectName);

Promise.resolve()
    .then(() => {
        console.log(`\nOptimize images in ${projectDir}.\n`);
        return optimizeImages(projectDir);
    })
    .catch(console.error);
