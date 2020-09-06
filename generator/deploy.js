const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const getPath = require('../js/getPath');
const logger = require('../js/logger');
const { deepCopyDirectory, execProcess } = require('../js/helpers');
const PROJ_INFO = require('../src/project-info.json');


const { projectName } = PROJ_INFO;
const projectDir = path.join(getPath.projectsDir, projectName);
const deployDir = path.join(projectDir, 'docs');

new Promise(resolve => {
    if (!fs.existsSync(deployDir)) {
        fs.mkdirSync(deployDir);
    }
    rimraf(path.join(deployDir, '*'), () => {
        deepCopyDirectory(path.resolve('build'), deployDir);
        logger.print('Copied build to project docs directory.', true);
        resolve();
    })
})
    .then(() => pushSubDir(projectDir))
    .catch(err => console.error(err));


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
