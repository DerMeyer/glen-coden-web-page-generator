const path = require('path');

const { PROJECTS_PATH_SEGMENTS } = require('../../confidential.json');

const projectsDir = path.resolve( ...PROJECTS_PATH_SEGMENTS);
const generatorDir = path.resolve('generator');
const optimizerDir = path.resolve('optimizer');
const publicDir = path.resolve('public');
const sourceDir = path.resolve('src');

module.exports = {
    projectsDir,
    generatorDir,
    optimizerDir,
    publicDir,
    sourceDir
};