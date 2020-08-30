const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const getPath = require('../js/getters/getPath');
const GEN_CONFIG = require('../generator-config.json');
const { deepCopyDirectory } = require('../js/helpers');

const projectName = GEN_CONFIG._project;
const buildDirectory = path.join(getPath.projectsDir, projectName, 'build');

rimraf(buildDirectory, () => {
    fs.mkdirSync(buildDirectory);
    deepCopyDirectory(path.resolve('build'), buildDirectory);
});

console.log(`\nFinalized ${projectName}.\n`);