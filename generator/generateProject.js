const path = require('path');
const fs = require('fs');

const copyStaticToPublic = require('./creators/copyStaticToPublic');
const createIndexHtml = require('./creators/createIndexHtml');
const createManifestJson = require('./creators/createManifestJson');

const { PROJECTS_PATH_SEGMENTS } = require('../confidential');

const projectsDir = path.resolve( ...PROJECTS_PATH_SEGMENTS);
const publicDir = path.resolve('public');
const sourceDir = path.resolve('src');

const activeProject = process.argv[2];

if (!fs.readdirSync(projectsDir).includes(activeProject)) {
    console.warn(`\nCouldn't find project with name ${activeProject}. Exit process.\n`);
    process.exit();
}

const projectDir = path.join(projectsDir, activeProject);

Promise.resolve()
    .then(() => {
        console.log(`\nCopy static assets into public directory:\n\tFROM ${path.join(projectDir, 'static')}\n\tTO ${publicDir}\n`);
        return copyStaticToPublic(path.join(projectDir, 'static'), publicDir);
    })
    .then(() => {
        console.log('Create index.html in /public\n');
        return createIndexHtml(projectDir, publicDir);
    })
    .then(() => {
        console.log('Create manifest.json in /public\n');
        return createManifestJson(projectDir, publicDir);
    })
    .then(() => {
        console.log('Create robots.txt in /public\n');
    })
    .then(() => {
        console.log('Expose generator-config values as generated.js in /src/js\n');
    })
    .then(() => {
        console.log('Create _Project.js in /src\n');
    })
    .then(() => {
        console.log('Expose config as _project-config.json in /src\n');
    })
    .catch(console.error);
