const path = require('path');
const fs = require('fs');
const generatorConfig = require('./generator-config');

const copyStaticToPublic = require('./generate/copyStaticToPublic');
const createIndexHtml = require('./generate/createIndexHtml');
const createManifestJson = require('./generate/createManifestJson');
const createRobotsTxt = require('./generate/createRobotsTxt');
const createValuesExport = require('./generate/createValuesExport');
const createProjectFile = require('./generate/createProjectFile');
const copyAppConfig = require('./generate/copyAppConfig');

const { PROJECTS_PATH_SEGMENTS } = require('../confidential');

const projectsDir = path.resolve( ...PROJECTS_PATH_SEGMENTS);
const publicDir = path.resolve('public');
const sourceDir = path.resolve('src');

if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
}

let projectName = process.argv[2];

if (!projectName) {
    projectName = generatorConfig._project;
    if (!fs.readdirSync(projectsDir).includes(projectName)) {
        console.warn(`\nCouldn't find project with name ${projectName} from generatorConfig._project. Exit process.\n`);
        process.exit();
    }
} else {
    if (!fs.readdirSync(projectsDir).includes(projectName)) {
        console.warn(`\nCouldn't find project with name ${projectName}. Exit process.\n`);
        process.exit();
    }
    if (projectName !== generatorConfig._project) {
        generatorConfig._project = projectName;
    }
}

generatorConfig._lastGenerated = projectName;
fs.writeFileSync(path.resolve('generator', 'generator-config.json'), JSON.stringify(generatorConfig, null, 4));

const projectDir = path.join(projectsDir, projectName);

Promise.resolve()
    .then(() => {
        console.log(`\nCopy static assets into public directory.\n\tFROM ${path.join(projectDir, 'static')}\n\tTO ${publicDir}\n`);
        return copyStaticToPublic(path.join(projectDir, 'static'), publicDir);
    })
    .then(() => {
        console.log('Create index.html in /public.\n');
        return createIndexHtml(projectDir, publicDir);
    })
    .then(() => {
        console.log('Create manifest.json in /public.\n');
        return createManifestJson(projectDir, publicDir);
    })
    .then(() => {
        console.log('Create robots.txt in /public.\n');
        return createRobotsTxt(publicDir);
    })
    .then(() => {
        console.log('Export generator-config values from generated.js in /src/js.\n');
        return createValuesExport(sourceDir);
    })
    .then(() => {
        console.log('Create _Project.js in /src.\n');
        return createProjectFile(projectDir, sourceDir);
    })
    .then(() => {
        console.log('Write config into app-config.json in /src.\n');
        return copyAppConfig(projectDir, sourceDir);
    })
    .catch(console.error);
