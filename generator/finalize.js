const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const getPath = require('../js/getters/getPath');
const { deepCopyDirectory, execProcess } = require('../js/helpers');
const GEN_CONFIG = require('../generator-config.json');


const projectName = GEN_CONFIG._project;
const projectDir = path.join(getPath.projectsDir, projectName);
const buildDirectory = path.join(projectDir, 'build');

new Promise(resolve => {
    if (!fs.existsSync(buildDirectory)) {
        fs.mkdirSync(buildDirectory);
    }
    rimraf(path.join(buildDirectory, '*'), () => {
        deepCopyDirectory(path.resolve('build'), buildDirectory);
        console.log('\nCopied build.\n');
        resolve();
    })
})
    .then(() => execProcess('git add .', { cwd: projectDir }))
    .then(() => execProcess('git status', { cwd: projectDir }))
    .then(() => execProcess(`git commit -m "Glen Coden auto commit at ${new Date().toISOString()}"`, { cwd: projectDir }))
    .then(() => execProcess('git push origin master', { cwd: projectDir }))
    .then(() => console.log(`\nFinalized ${projectName}.\n`))
    .catch(err => console.error(err));
