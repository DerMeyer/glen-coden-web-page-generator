const path = require('path');

const { PROJECTS_PATH_SEGMENTS } = require('../../../confidential');

const projectsDir = path.resolve( ...PROJECTS_PATH_SEGMENTS);
const generatorDir = path.resolve('generator');
const publicDir = path.resolve('public');
const sourceDir = path.resolve('src');

module.exports = {
    projectsDir,
    generatorDir,
    publicDir,
    sourceDir
};