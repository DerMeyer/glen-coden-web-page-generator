const path = require('path');
const fs = require('fs');
const generatorConfig = require('./generator-config');

const createStaticContents = require('./bootstrap/createStaticContents');
const createConfig = require('./bootstrap/createConfig');

const { PROJECTS_PATH_SEGMENTS } = require('../confidential');

const projectsDir = path.resolve( ...PROJECTS_PATH_SEGMENTS);
const bootstrapDir = path.resolve('generator', 'bootstrap');

const projectName = process.argv[2];

if (!projectName) {
    console.warn(`\nCouldn't bootstrap project. Please pass a project name as first arg to the bootstrap command.\n`);
    process.exit();
}

if (fs.readdirSync(projectsDir).includes(projectName)) {
    console.warn(`\nCouldn't bootstrap project. The project name already exists.\n`);
    process.exit();
}

generatorConfig._project = projectName;
fs.writeFileSync(path.resolve('generator', 'generator-config.json'), JSON.stringify(generatorConfig, null, 4));

const projectDir = path.join(projectsDir, projectName);

fs.mkdirSync(projectDir);

Promise.resolve()
    .then(() => {
        console.log(`\nBootstrap static contents in ${projectDir}.\n`);
        return createStaticContents(projectDir, bootstrapDir);
    })
    .then(() => {
        console.log('Create config on root level.\n');
        return createConfig(projectDir);
    })
    .catch(console.error);
