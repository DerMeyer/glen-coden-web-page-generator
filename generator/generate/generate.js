const path = require('path');
const fs = require('fs');
const getPath = require('../../js/getPath');

const generateProjectInfo = require('./generate.projectInfo');
const generatePublicAssets = require('./generate.publicAssets');
const generateIndexHtml = require('./generate.indexHtml');
const generateManifestJson = require('./generate.manifestJson');
const generateRobotsTxt = require('./generate.robotsTxt');
const generateSvgExport = require('./generate.svgExport');
const generateProjectFile = require('./generate.projectFile');

const projectName = process.argv[2];
const projectDir = path.join(getPath.projectsDir, projectName);

if (!fs.readdirSync(getPath.projectsDir).includes(projectName)) {
    console.warn(`\nCouldn't find project with name ${projectName}. Exit process.\n`);
    process.exit();
}

if (!fs.existsSync(getPath.publicDir)) {
    fs.mkdirSync(getPath.publicDir);
}


Promise.resolve()
    .then(() => {
        console.log('Generate project-info in src.\n');
        return generateProjectInfo(getPath.sourceDir, projectName);
    })
    .then(() => {
        console.log(`\nCopy static assets into public directory.\nFROM ${path.join(projectDir, 'static')}\nTO ${getPath.publicDir}\n`);
        return generatePublicAssets(projectDir, getPath.publicDir);
    })
    .then(() => {
        console.log('Generate index.html in /public.\n');
        return generateIndexHtml(getPath.sourceDir, getPath.publicDir);
    })
    .then(() => {
        console.log('Generate manifest.json in /public.\n');
        return generateManifestJson(getPath.sourceDir, projectDir, getPath.publicDir);
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
        return generateProjectFile(getPath.sourceDir, getPath.sourceDir);
    })
    .catch(console.error);
