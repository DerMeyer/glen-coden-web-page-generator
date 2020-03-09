const path = require('path');
const fs = require('fs');
const getPath = require('../js/getters/getPath');
const setConfig = require('../js/setters/setConfig');

const bootstrapFileTree = require('./bootstrap.fileTree');
const bootstrapConfig = require('./bootstrap.config');

const projectName = process.argv[2];

if (!projectName) {
    console.warn(`\nCouldn't bootstrap project. Please pass a project name as first arg to the bootstrap command.\n`);
    process.exit();
}

if (fs.readdirSync(getPath.projectsDir).includes(projectName)) {
    console.warn(`\nCouldn't bootstrap project. The project name already exists.\n`);
    process.exit();
}

const configUpdate = {
    _project: projectName
};

setConfig(configUpdate);

const bootstrapDir = path.join(getPath.generatorDir, 'bootstrap');
const projectDir = path.join(getPath.projectsDir, projectName);

fs.mkdirSync(projectDir);

Promise.resolve()
    .then(() => {
        console.log(`\nBootstrap static contents in ${projectDir}.\n`);
        return bootstrapFileTree(projectDir, bootstrapDir);
    })
    .then(() => {
        console.log('Create config on root level.\n');
        return bootstrapConfig(projectDir);
    })
    .catch(console.error);
