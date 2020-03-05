const path = require('path');
const fs = require('fs');
const getPath = require('../js/getters/getPath');
const CONFIG = require('../generator-config');

const updateComponentsList = require('./update.componentsList');
const updateAppConfig = require('./update.appConfig');

let projectName = process.argv[2];

if (!projectName) {
    projectName = CONFIG._project;
}

if (!fs.readdirSync(getPath.projectsDir).includes(projectName)) {
    console.warn(`\nCouldn't find project with name ${projectName}. Exit process.\n`);
    process.exit();
}

const projectDir = path.join(getPath.projectsDir, projectName);

Promise.resolve()
    .then(() => {
        console.log('\nUpdate components list.\n');
        return updateComponentsList(getPath.sourceDir, getPath.generatorDir);
    })
    .then(() => {
        console.log('Update components map.\n');
        return updateAppConfig(getPath.sourceDir, projectDir);
    })
    .catch(console.error);