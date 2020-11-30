const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const getPath = require('../js/getPath');
const logger = require('../js/logger');
const { deepCopyDirectory, execProcess } = require('../js/helpers');
const PROJ_INFO = require('../src/project-info.json');


const { projectName } = PROJ_INFO;
const devBuildDirName = 'docs';
const prodBuildDirName = 'production-build';

const projectDir = path.join(getPath.projectsDir, projectName);
const devBuildDir = path.join(projectDir, devBuildDirName);
const prodBuildDir = path.join(projectDir, prodBuildDirName);


if (process.argv[2] === '--prod') {
    deployProd();
} else {
    deployDev();
}


function deployDev() {
    new Promise(resolve => {
        if (!fs.existsSync(devBuildDir)) {
            fs.mkdirSync(devBuildDir);
        }
        rimraf(path.join(devBuildDir, '*'), () => {
            deepCopyDirectory(path.resolve('build'), devBuildDir);
            logger.print(`Copied build to development-build directory (${devBuildDirName}).`, true);
            resolve();
        })
    })
        .then(() => pushSubDir(projectDir))
        .catch(err => console.error(err));
}

function deployProd() {
    new Promise(resolve => {
        if (!fs.existsSync(prodBuildDir)) {
            fs.mkdirSync(prodBuildDir);
        }
        rimraf(path.join(prodBuildDir, '*'), () => {
            deepCopyDirectory(path.resolve('build'), prodBuildDir);
            logger.print(`Copied build to production build directory (${prodBuildDirName}).`, true);
            resolve();
        })
    })
        .then(() => pushSubDir(prodBuildDir))
        .catch(err => console.error(err));
}

function pushSubDir(dir) {
    return Promise.resolve()
        .then(() => execProcess('git add .', { cwd: dir }))
        .then(() => execProcess('git status', { cwd: dir }))
        .then(() => execProcess(`git commit -m "Glen Coden auto commit at ${new Date().toISOString()}"`, { cwd: dir }))
        .then(() => execProcess('git push origin master', { cwd: dir }))
        .then(() => {
            logger.success('Project deployed');
        })
}
