const fs = require('fs');
const path = require('path');
const generatorConfig = require('./generator-config');

const sourcePath = path.resolve('src');
const projectsPath = path.join(sourcePath, 'projects');
const availableProjects = fs.readdirSync(projectsPath);

let activeProject = generatorConfig.activeProject;
if (!availableProjects.includes(activeProject)) {
    activeProject = '_default';
}

// TODO generate projectImports.js and index.html, include missingProject prop in _default case