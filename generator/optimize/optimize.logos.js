const path = require('path');
const fs = require('fs');

const GEN_CONFIG = require('../generator-config');
const targetLogoList = GEN_CONFIG.logos;
const { hasFreeApiCalls, addCallCount } = require('../statistics/tinifyApi/manageCallCount');
const optimizeTinify = require('./optimize.tinify');

function optimizeLogos(projectDir) {
    return new Promise(resolve => {
        const logoDir = path.join(projectDir, 'static');
        const sourceLogoName = 'logo.png';
        const sourceLogoPath = path.join(logoDir, sourceLogoName);

        if (!fs.existsSync(sourceLogoPath)) {
            console.log(`\nCouldn't find logo.png in ${sourceLogoPath}.\n`);
            process.exit();
        }

        const previousOptimized = fs.readdirSync(logoDir).filter(fileName => fileName.endsWith('.png'));
        previousOptimized.splice(previousOptimized.indexOf(sourceLogoName), 1);

        const maxEstimatedApiCalls = targetLogoList.length * 2;

        if (!hasFreeApiCalls(maxEstimatedApiCalls)) {
            process.exit();
        }

        let apiCalls = 0;

        Promise.all(
            targetLogoList.map(logo => {
                if (previousOptimized.includes(logo.src)) {
                    previousOptimized.splice(previousOptimized.indexOf(logo.src), 1);
                    return Promise.resolve()
                        .then(() => console.log(`Optimized logo ${logo.src} already exists.`));
                }
                const [width, height] = logo.sizes.split('x');
                const options = {
                    method: 'cover',
                    width: parseInt(width, 10),
                    height: parseInt(height, 10)
                };
                return optimizeTinify(sourceLogoPath, path.join(logoDir, logo.src), options)
                    .then(() => {
                        apiCalls += 2;
                        console.log(`Saved optimized logo ${logo.src}`);
                    });
            })
        )
            .then(() => {
                previousOptimized.forEach(prevFile => {
                    fs.unlinkSync(path.join(logoDir, prevFile));
                    console.log(`Deleted previously optimized logo ${prevFile}`);
                });
                addCallCount(apiCalls);
                resolve();
            })
    });
}

module.exports = optimizeLogos;