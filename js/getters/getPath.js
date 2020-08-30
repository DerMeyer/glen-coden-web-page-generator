const path = require('path');
const GEN_CONFIG = require('../../generator-config.json');

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

module.exports = {
    projectsDir,
    generatorDir,
    optimizerDir,
    publicDir,
    sourceDir
};