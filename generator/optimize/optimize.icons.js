const path = require('path');
const fs = require('fs');

const GEN_CONFIG = require('../generator-config');
const supportedImageTypes = GEN_CONFIG.imageTypesForOptimization;
const { targetIconSizes } = require('../../src/js/generated');
const { hasFreeApiCalls, addCallCount } = require('../statistics/tinifyApi/manageCallCount');
const optimizeTinify = require('./optimize.tinify');

function optimizeIcons(projectDir) {
    return new Promise(resolve => {
        const iconDir = path.join(projectDir, 'static', 'icons');
        const targetDirName = 'optimized';
        const targetDir = path.join(iconDir, targetDirName);

        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir);
        }

        const icons = fs.readdirSync(iconDir).filter(fileName => !GEN_CONFIG.ignore.includes(fileName) && fileName !== targetDirName);
        const previousOptimized = fs.readdirSync(targetDir);
        const maxEstimatedApiCalls = (icons.length - 1) * targetIconSizes.length * 2;

        if (!hasFreeApiCalls(maxEstimatedApiCalls)) {
            process.exit();
        }

        let apiCalls = 0;

        Promise.all(
            icons.map(fileName => {
                const nameParts = fileName.split('.');
                const iconType = nameParts.pop();
                const iconName = nameParts.join('.');
                if (!supportedImageTypes.includes(iconType)) {
                    return Promise.resolve()
                        .then(() => console.log(`Type of ${fileName} is not supported.`));
                }
                return Promise.all(
                    targetIconSizes.map(iconSize => {
                        const targetName = `${iconName}_${iconSize}.${iconType}`;
                        if (previousOptimized.includes(targetName)) {
                            previousOptimized.splice(previousOptimized.indexOf(targetName), 1);
                            return Promise.resolve()
                                .then(() => console.log(`Optimized icon ${targetName} already exists.`));
                        }
                        const options = {
                            method: 'scale',
                            width: iconSize
                        };
                        return optimizeTinify(path.join(iconDir, fileName), path.join(targetDir, targetName), options)
                            .then(() => {
                                apiCalls += 2;
                                console.log(`Saved optimized icon ${targetName}`);
                            });
                    })
                );
            })
        )
            .then(() => {
                previousOptimized.forEach(prevFile => {
                    fs.unlinkSync(path.join(targetDir, prevFile));
                    console.log(`Deleted previously optimized icon ${prevFile}`);
                });
                addCallCount(apiCalls);
                resolve();
            })
    });
}

module.exports = optimizeIcons;