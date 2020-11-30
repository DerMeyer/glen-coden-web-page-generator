const path = require('path');
const GEN_CONFIG = require('../generator-config.json');

const {
    projectsDirSegments,
    generatorDirSegments,
    optimizerDirSegments,
    publicDirSegments,
    sourceDirSegments
} = GEN_CONFIG.paths;

const projectsDir = path.resolve(...projectsDirSegments);
const generatorDir = path.resolve(...generatorDirSegments);
const optimizerDir = path.resolve(...optimizerDirSegments);
const publicDir = path.resolve(...publicDirSegments);
const sourceDir = path.resolve(...sourceDirSegments);

const api = 'http://116.202.99.153/api';

module.exports = {
    projectsDir,
    generatorDir,
    optimizerDir,
    publicDir,
    sourceDir,
    api
};