const path = require('path');
const fs = require('fs');
const getPath = require('../js/getters/getPath');
const setConfig = require('../js/setters/setConfig');
const CONFIG = require('../generator-config');

const generatePublicAssets = require('./generate.publicAssets');
const generateIndexHtml = require('./generate.indexHtml');
const generateManifestJson = require('./generate.manifestJson');
const generateRobotsTxt = require('./generate.robotsTxt');
const generateValuesExport = require('./generate.valuesExport');
const generateProjectFile = require('./generate.projectFile');
const generateAppConfig = require('./generate.appConfig');

if (!fs.existsSync(getPath.publicDir)) {
    fs.mkdirSync(getPath.publicDir);
}

const configUpdate = {};
let projectName = process.argv[2];

if (!projectName) {
    projectName = CONFIG._project;
    if (!fs.readdirSync(getPath.projectsDir).includes(projectName)) {
        console.warn(`\nCouldn't find project with name ${projectName}. Exit process.\n`);
        process.exit();
    }
} else {
    if (!fs.readdirSync(getPath.projectsDir).includes(projectName)) {
        console.warn(`\nCouldn't find project with name ${projectName}. Exit process.\n`);
        process.exit();
    }
    if (projectName !== CONFIG._project) {
        configUpdate._project = projectName;
    }
}

configUpdate._lastGenerated = projectName;
setConfig(configUpdate);

const projectDir = path.join(getPath.projectsDir, projectName);

Promise.resolve()
    .then(() => {
        console.log(`\nCopy static assets into public directory.\n\tFROM ${path.join(projectDir, 'static')}\n\tTO ${getPath.publicDir}\n`);
        return generatePublicAssets(projectDir, getPath.publicDir);
    })
    .then(() => {
        console.log('Generate index.html in /public.\n');
        return generateIndexHtml(projectDir, getPath.publicDir);
    })
    .then(() => {
        console.log('Generate manifest.json in /public.\n');
        return generateManifestJson(projectDir, getPath.publicDir);
    })
    .then(() => {
        console.log('Generate robots.txt in /public.\n');
        return generateRobotsTxt(getPath.publicDir);
    })
    .then(() => {
        console.log('Export generator-config values from generated.js in /src/js.\n');
        return generateValuesExport(getPath.sourceDir);
    })
    .then(() => {
        console.log('Generate _Project.js in /src.\n');
        return generateProjectFile(projectDir, getPath.sourceDir);
    })
    .then(() => {
        console.log('Write config into app-config.json in /src.\n');
        return generateAppConfig(projectDir, getPath.sourceDir);
    })
    .catch(console.error);
