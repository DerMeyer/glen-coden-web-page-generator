const path = require('path');
const fs = require('fs');

const copyStaticToPublic = require('./creators/copyStaticToPublic');
const createIndexHtml = require('./creators/createIndexHtml');

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
        console.log(`\nCopy static assets into public directory...\n\nFROM ${path.join(projectDir, 'static')}\nTO ${publicDir}\n`);
        return copyStaticToPublic(path.join(projectDir, 'static'), publicDir);
    })
    .then(() => {
        return createIndexHtml(projectDir, publicDir);
    })
    .then(() => console.log('generate public/manifest.json'))
    .then(() => console.log('generate public/robots.txt'))
    .then(() => console.log('generate src/js/generated.js'))
    .then(() => console.log('generate src/_Project.js'))
    .then(() => console.log('generate src/_project-config.json'))
    .catch(console.error);
