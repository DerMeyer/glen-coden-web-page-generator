const path = require('path');
const fs = require('fs');
const getPath = require('../js/getters/getPath');
const optimizeAssets = require('./optimizeAssets');

const projectName = process.argv[2];

if (!projectName) {
    console.warn(`\nCouldn't optimize assets. Please pass a project name as first arg to the optimize command.\n`);
    process.exit();
}

const projectDir = path.join(getPath.projectsDir, projectName);

if (!fs.existsSync(projectDir)) {
    console.warn(`\nCouldn't find ${projectDir}.\n`);
    process.exit();
}

const OPTIMIZE_CONFIG = require('./optimize-config.json');

Object.keys(OPTIMIZE_CONFIG).forEach(assetType => {
    const entry = OPTIMIZE_CONFIG[assetType];
    const dir = path.join(projectDir, ...entry.path);
    const assets = fs.readdirSync(dir).filter(e => entry.sources.find(src => e.endsWith(src)));
    optimizeAssets(dir, assets, entry.sizes, entry.custom)
        .then(() => console.log(`Optimized ${assetType} in ${projectDir}.\n`));
});
