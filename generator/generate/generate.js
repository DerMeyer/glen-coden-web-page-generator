const path = require('path');
const fs = require('fs');
const logger = require('../../js/logger');
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
    logger.warn(`Couldn't find project with name ${projectName}. Exit process.`, true, true);
    process.exit();
}

if (!fs.existsSync(getPath.publicDir)) {
    fs.mkdirSync(getPath.publicDir);
}

logger.title('run generate.js');

Promise.resolve()
    .then(() => {
        logger.print('Write dev-project-config into src directory.');
        return generateProjectInfo(getPath.sourceDir, projectName);
    })
    .then(() => {
        logger.print('Copy static assets into public directory.');
        return generatePublicAssets(projectDir, getPath.publicDir);
    })
    .then(() => {
        logger.print('Create index.html in public directory.');
        return generateIndexHtml(getPath.sourceDir, getPath.publicDir);
    })
    .then(() => {
        logger.print('Create manifest.json in public directory.');
        return generateManifestJson(getPath.sourceDir, projectDir, getPath.publicDir);
    })
    .then(() => {
        logger.print('Create robots.txt in public directory.');
        return generateRobotsTxt(getPath.publicDir);
    })
    .then(() => {
        logger.print('Export SVGs as ReactComponents in src/js directory.');
        return generateSvgExport(getPath.sourceDir, getPath.projectsDir, projectName);
    })
    .then(() => {
        logger.print('Create _Project.js in src directory.');
        return generateProjectFile(getPath.sourceDir, getPath.sourceDir);
    })
    .then(() => {
        logger.success('Generated');
    })
    .catch(console.error);
