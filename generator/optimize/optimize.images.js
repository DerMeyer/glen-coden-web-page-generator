const path = require('path');
const fs = require('fs');

const tinify = require('tinify');
const { TINIFY_API_KEY } = require('../../confidential');
tinify.key = TINIFY_API_KEY;

const CONFIG = require('../generator-config');
const supportedImageTypes = CONFIG.imageTypesForOptimization;
const { targetImageSizes } = require('../../src/js/generated');

const { hasFreeApiCalls, addCallCount } = require('../statistics/tinifyApi/manageCallCount');

function optimizeImages(projectDir) {
    return new Promise(resolve => {
        const imageDir = path.join(projectDir, 'static', 'images');
        const targetDirName = 'optimized';
        const targetDir = path.join(imageDir, targetDirName);

        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir);
        }

        const images = fs.readdirSync(imageDir).filter(fileName => !CONFIG.ignore.includes(fileName));
        const previousOptimized = fs.readdirSync(targetDir);
        const maxEstimatedApiCalls = (images.length - 1) * targetImageSizes.length;

        console.log('\nOptimizing images...\n');

        if (!hasFreeApiCalls(maxEstimatedApiCalls)) {
            process.exit();
        }

        let apiCalls = 0;

        Promise.all(
            images.map(fileName => {
                const nameParts = fileName.split('.');
                const imageType = nameParts.pop();
                const imageName = nameParts.join('.');
                if (!supportedImageTypes.includes(imageType)) {
                    return Promise.resolve()
                        .then(() => {
                            if (fileName === targetDirName) {
                                return;
                            }
                            console.log(`Type of ${fileName} is not supported.`);
                        });
                }
                return Promise.all(
                    targetImageSizes.map(imageSize => {
                        const targetName = `${imageName}_${imageSize.ratio}_${imageSize.width}.${imageType}`;
                        if (previousOptimized.includes(targetName)) {
                            previousOptimized.splice(previousOptimized.indexOf(targetName), 1);
                            return Promise.resolve()
                                .then(() => console.log(`Optimized image ${targetName} already exists.`));
                        }
                        const options = {};
                        switch (imageSize.ratio) {
                            case 'default':
                                options.method = 'scale';
                                options.width = imageSize.width;
                                break;
                            case 'portrait':
                                options.method = 'cover';
                                options.width = imageSize.width;
                                options.height = imageSize.height;
                                break;
                            default:
                        }
                        return tinify
                            .fromFile(path.join(imageDir, fileName))
                            .resize(options)
                            .toFile(path.join(targetDir, targetName))
                            .then(() => {
                                apiCalls += 2;
                                console.log(`Saved optimized image ${targetName}`);
                            });
                    })
                );
            })
        )
            .then(() => {
                previousOptimized.forEach(prevFile => {
                    fs.unlinkSync(path.join(targetDir, prevFile));
                    console.log(`Deleted previously optimized image ${prevFile}`);
                });
                addCallCount(apiCalls);
                console.log('\nDone.');
                resolve();
            })
    });
}

module.exports = optimizeImages;