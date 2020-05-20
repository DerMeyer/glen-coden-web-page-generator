const path = require('path');
const fs = require('fs');
const getPath = require('../../js/getters/getPath');

const updateComponentsList = require('./update.componentsList');
const updateProjectConfig = require('./update.projectConfig');

let projectName = process.argv[2];

if (!projectName) {
    console.warn(`\nCouldn't update project. Please pass a project name as first arg to the update command.\n`);
    process.exit();
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
        console.log('Update project config.\n');
        return updateProjectConfig(getPath.sourceDir, projectDir, projectName);
    })
    .catch(console.error);
