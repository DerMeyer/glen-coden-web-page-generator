const path = require('path');
const fs = require('fs');
const logger = require('../../js/logger');
const getPath = require('../../js/getPath');

const bootstrapFileTree = require('./bootstrap.fileTree');
const bootstrapConfig = require('./bootstrap.config');

const projectName = process.argv[2];

if (!projectName) {
    logger.warn(`Couldn't bootstrap project. Please pass a project name as first arg to the bootstrap command.`, true, true);
    process.exit();
}

if (fs.readdirSync(getPath.projectsDir).includes(projectName)) {
    logger.warn(`Couldn't bootstrap project. The project name already exists.`, true, true);
    process.exit();
}

const bootstrapDir = path.join(getPath.generatorDir, 'bootstrap');
const projectDir = path.join(getPath.projectsDir, projectName);

fs.mkdirSync(projectDir);

logger.title('run bootstrap.js');

Promise.resolve()
    .then(() => {
        logger.print('Bootstrap static contents.');
        return bootstrapFileTree(projectDir, bootstrapDir);
    })
    .then(() => {
        logger.print('Bootstrap config.');
        return bootstrapConfig(getPath.sourceDir, projectName);
    })
    .then(() => {
        logger.success('Bootstrapped');
    })
    .catch(console.error);
