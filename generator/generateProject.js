const path = require('path');
const fs = require('fs');

const generatorConfig = require('./generator-config');

const copyStaticToPublic = require('./copyStaticToPublic');

const projectsPath = path.resolve('projects');
const publicPath = path.resolve('public');
const sourcePath = path.resolve('src');

const activeProject = generatorConfig.activeProject;

if (!fs.readdirSync(projectsPath).includes(activeProject)) {
    console.warn(`Couldn't find project with name ${activeProject}`);
    process.exit();
}

copyStaticToPublic(path.join(projectsPath, activeProject, 'static'), publicPath)
    .then(() => console.log('generate public/index.html'))
    .then(() => console.log('generate public/manifest.json'))
    .then(() => console.log('generate public/robots.txt'))
    .then(() => console.log('generate src/js/generated.js'))
    .then(() => console.log('generate src/_Project.js'))
    .then(() => console.log('generate src/_project-config.json'))
    .catch(console.error);
