const path = require('path');
const fs = require('fs');
const generatorConfig = require('./generator-config');

const updateComponentsList = require('./update/updateComponentsList');
const updateComponentsMap = require('./update/updateComponentsMap');

const { PROJECTS_PATH_SEGMENTS } = require('../confidential');

const generatorDir = path.resolve('generator');
const projectsDir = path.resolve( ...PROJECTS_PATH_SEGMENTS);
const sourceDir = path.resolve('src');
const componentsDirName = 'components';

let projectName = process.argv[2];

if (!projectName) {
    projectName = generatorConfig._project;
}

if (!fs.readdirSync(projectsDir).includes(projectName)) {
    console.warn(`\nCouldn't find project with name ${projectName}. Exit process.\n`);
    process.exit();
}

const projectDir = path.join(projectsDir, projectName);

Promise.resolve()
    .then(() => {
        console.log('\nUpdate components list.\n');
        return updateComponentsList(sourceDir, componentsDirName, [projectDir, generatorDir]);
    })
    .then(() => {
        console.log('Update components map.\n');
        return updateComponentsMap(projectDir)
    })
    .catch(console.error);
