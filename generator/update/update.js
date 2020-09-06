const path = require('path');
const fs = require('fs');
const logger = require('../../js/logger');
const getPath = require('../../js/getPath');

const updateComponentsList = require('./update.componentsList');
const updateProjectConfig = require('./update.projectConfig');

let projectName = process.argv[2];

if (!projectName) {
    logger.warn(`Couldn't update project. Please pass a project name as first arg to the update command.`, true, true);
    process.exit();
}

if (!fs.readdirSync(getPath.projectsDir).includes(projectName)) {
    logger.warn(`Couldn't find project with name ${projectName}. Exit process.`, true, true);
    process.exit();
}

const projectDir = path.join(getPath.projectsDir, projectName);

logger.title('run update.js');

Promise.resolve()
    .then(() => {
        logger.print('Update components list.');
        return updateComponentsList(getPath.sourceDir, getPath.generatorDir);
    })
    .then(() => {
        logger.print('Update project config.');
        return updateProjectConfig(getPath.sourceDir, projectDir, projectName);
    })
    .then(() => {
        logger.success('Updated');
    })
    .catch(console.error);
