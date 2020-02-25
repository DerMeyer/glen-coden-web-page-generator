const path = require('path');
const fs = require('fs');
const getPath = require('./js/getters/getPath');
const setConfig = require('./js/setters/setConfig');
const config = require('./generator-config');

const copyStaticToPublic = require('./generate/copyStaticToPublic');
const createIndexHtml = require('./generate/createIndexHtml');
const createManifestJson = require('./generate/createManifestJson');
const createRobotsTxt = require('./generate/createRobotsTxt');
const createValuesExport = require('./generate/createValuesExport');
const createProjectFile = require('./generate/createProjectFile');
const copyAppConfig = require('./generate/copyAppConfig');

if (!fs.existsSync(getPath.publicDir)) {
    fs.mkdirSync(getPath.publicDir);
}

const configUpdate = {};
let projectName = process.argv[2];

if (!projectName) {
    projectName = config._project;
    if (!fs.readdirSync(getPath.projectsDir).includes(projectName)) {
        console.warn(`\nCouldn't find project with name ${projectName}. Exit process.\n`);
        process.exit();
    }
} else {
    if (!fs.readdirSync(getPath.projectsDir).includes(projectName)) {
        console.warn(`\nCouldn't find project with name ${projectName}. Exit process.\n`);
        process.exit();
    }
    if (projectName !== config._project) {
        configUpdate._project = projectName;
    }
}

configUpdate._lastGenerated = projectName;
setConfig(configUpdate);

const projectDir = path.join(getPath.projectsDir, projectName);

Promise.resolve()
    .then(() => {
        console.log(`\nCopy static assets into public directory.\n\tFROM ${path.join(projectDir, 'static')}\n\tTO ${getPath.publicDir}\n`);
        return copyStaticToPublic(projectDir, getPath.publicDir);
    })
    .then(() => {
        console.log('Create index.html in /public.\n');
        return createIndexHtml(projectDir, getPath.publicDir);
    })
    .then(() => {
        console.log('Create manifest.json in /public.\n');
        return createManifestJson(projectDir, getPath.publicDir);
    })
    .then(() => {
        console.log('Create robots.txt in /public.\n');
        return createRobotsTxt(getPath.publicDir);
    })
    .then(() => {
        console.log('Export generator-config values from generated.js in /src/js.\n');
        return createValuesExport(getPath.sourceDir);
    })
    .then(() => {
        console.log('Create _Project.js in /src.\n');
        return createProjectFile(projectDir, getPath.sourceDir);
    })
    .then(() => {
        console.log('Write config into app-config.json in /src.\n');
        return copyAppConfig(projectDir, getPath.sourceDir);
    })
    .catch(console.error);
