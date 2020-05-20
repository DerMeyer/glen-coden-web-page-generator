const path = require('path');
const fs = require('fs');
const { isObject } = require('../js/helpers');
const { createImageFileName } = require('../js/shared');
const { hasFreeApiCalls, addCallCount } = require('./statistics/tinifyApi/manageCallCount');
const optimizeTinify = require('./optimize.tinify');
const GEN_CONFIG = require('../generator/generator-config.json');

function optimizeAssets(projectDir, assetType) {
    return new Promise(resolve => {
        const OPTIMIZE_CONFIG = GEN_CONFIG[assetType];

        if (!isObject(OPTIMIZE_CONFIG)) {
            console.warn(`Couldn't find OPTIMIZE_CONFIG for assetType ${assetType}`);
            process.exit();
        }

        const assetsDir = path.join(projectDir, ...OPTIMIZE_CONFIG.sourcePath);
        const targetDir = path.join(projectDir, ...OPTIMIZE_CONFIG.targetPath);

        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir);
        }

        const getSourceAssets = list => list
            .filter(fileName =>
                !GEN_CONFIG.ignore.includes(fileName)
                && OPTIMIZE_CONFIG.sources.some(source => fileName.endsWith(source))
            );

        const assets = getSourceAssets(fs.readdirSync(assetsDir));
        const prevOptimized = getSourceAssets(fs.readdirSync(targetDir));

        const maxEstimatedApiCalls = assets.length * OPTIMIZE_CONFIG.optionList.length * 2;

        if (!hasFreeApiCalls(maxEstimatedApiCalls)) {
            process.exit();
        }

        let apiCalls = 0;

        Promise.all(
            assets.map(
                fileName => Promise.all(
                    OPTIMIZE_CONFIG.optionList.map(options => {
                        const targetName = options.name || createImageFileName(fileName, options);
                        delete options.name;

                        if (prevOptimized.includes(targetName)) {
                            prevOptimized.splice(prevOptimized.indexOf(targetName), 1);
                            return Promise.resolve()
                                .then(() => console.log(`Optimized asset ${targetName} already exists.`));
                        }

                        const source = path.join(assetsDir, fileName);
                        const target = path.join(targetDir, targetName);

                        return optimizeTinify(source, target, options)
                            .then(() => {
                                apiCalls += 2;
                                console.log(`Saved optimized asset ${targetName}`);
                            });
                    })
                )
            )
        )
            .then(() => {
                prevOptimized.forEach(prevFile => {
                    fs.unlinkSync(path.join(targetDir, prevFile));
                    console.log(`Deleted asset ${prevFile}`);
                });
                addCallCount(apiCalls);
                resolve();
            });
    });
}

module.exports = optimizeAssets;