const path = require('path');
const fs = require('fs');
const getPath = require('../../js/getters/getPath');
const setGeneratorConfig = require('../../js/setters/setGeneratorConfig');
const GEN_CONFIG = require('../../generator-config.json');

const generatePublicAssets = require('./generate.publicAssets');
const generateIndexHtml = require('./generate.indexHtml');
const generateManifestJson = require('./generate.manifestJson');
const generateRobotsTxt = require('./generate.robotsTxt');
const generateSvgExport = require('./generate.svgExport');
const generateProjectFile = require('./generate.projectFile');

if (!fs.existsSync(getPath.publicDir)) {
    fs.mkdirSync(getPath.publicDir);
}

const projectName = process.argv[2];

if (!projectName) {
    console.warn(`\nCouldn't generate project. Please pass a project name as first arg to the generate command.\n`);
    process.exit();
}

if (!fs.readdirSync(getPath.projectsDir).includes(projectName)) {
    console.warn(`\nCouldn't find project with name ${projectName}. Exit process.\n`);
    process.exit();
}

if (projectName !== GEN_CONFIG._project) {
    setGeneratorConfig({
        _project: projectName
    });
}

const projectDir = path.join(getPath.projectsDir, projectName);

Promise.resolve()
    .then(() => {
        console.log(`\nCopy static assets into public directory.\nFROM ${path.join(projectDir, 'static')}\nTO ${getPath.publicDir}\n`);
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
        console.log('Export svg as ReactComponent in /src/js.\n');
        return generateSvgExport(getPath.sourceDir);
    })
    .then(() => {
        console.log('Generate _Project.js in /src.\n');
        return generateProjectFile(projectDir, getPath.sourceDir);
    })
    .catch(console.error);
