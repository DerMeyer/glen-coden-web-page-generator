const path = require('path');
const fs = require('fs');

const CONFIG = require('../generator-config');
const targetIconList = CONFIG.icons;
const { hasFreeApiCalls, addCallCount } = require('../statistics/tinifyApi/manageCallCount');
const optimizeTinify = require('./optimize.tinify');

function optimizeIcons(projectDir) {
    return new Promise(resolve => {
        const iconDir = path.join(projectDir, 'static');
        const sourceIconName = 'icon.png';
        const sourceIconPath = path.join(iconDir, sourceIconName);

        if (!fs.existsSync(sourceIconPath)) {
            console.log(`\nCouldn't find icon.png in ${sourceIconPath}.\n`);
            process.exit();
        }

        const previousOptimized = fs.readdirSync(iconDir).filter(fileName => fileName.endsWith('.png'));
        previousOptimized.splice(previousOptimized.indexOf(sourceIconName), 1);

        const maxEstimatedApiCalls = targetIconList.length * 2;

        console.log('\nOptimizing icons...\n');

        if (!hasFreeApiCalls(maxEstimatedApiCalls)) {
            process.exit();
        }

        let apiCalls = 0;

        Promise.all(
            targetIconList.map(icon => {
                if (previousOptimized.includes(icon.src)) {
                    previousOptimized.splice(previousOptimized.indexOf(icon.src), 1);
                    return Promise.resolve()
                        .then(() => console.log(`Optimized icon ${icon.src} already exists.`));
                }
                const [width, height] = icon.sizes.split('x');
                const options = {
                    method: 'cover',
                    width: parseInt(width, 10),
                    height: parseInt(height, 10)
                };
                return optimizeTinify(sourceIconPath, path.join(iconDir, icon.src), options)
                    .then(() => {
                        apiCalls += 2;
                        console.log(`Saved optimized icon ${icon.src}`);
                    });
            })
        )
            .then(() => {
                previousOptimized.forEach(prevFile => {
                    fs.unlinkSync(path.join(iconDir, prevFile));
                    console.log(`Deleted previously optimized icon ${prevFile}`);
                });
                addCallCount(apiCalls);
                console.log('\nDone.');
                resolve();
            })
    });
}

module.exports = optimizeIcons;