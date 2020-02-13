import { TargetImageRatios } from '../src/js/helpers';

const path = require('path');
const fs = require('fs');

const tinify = require('tinify');
const { TINIFY_API_KEY } = require('../confidential');
tinify.key = TINIFY_API_KEY;

const supportedImageTypes = [ 'jpg', 'jpeg', 'png' ];
const { targetImageSizes } = require('../src/js/helpers');
const { activeProject } = require('./generator-config');

const imageDirectory = path.resolve( 'public', activeProject, 'images');
const targetDirectoryName = 'optimized';
const targetDirectory = path.join(imageDirectory, targetDirectoryName);

if (!fs.existsSync(targetDirectory)) {
    fs.mkdirSync(targetDirectory);
}

const images = fs.readdirSync(imageDirectory);
const optimizedImages = fs.readdirSync(targetDirectory);

const { START_AT, COUNT } = require('./statistics/tinifyApiCallCount');

const timeSinceCounterStart = Date.now() - START_AT;
const monthInMilliseconds = 1000 * 60 * 60 * 24 * 28;

let updatedStartAt = START_AT;
let updatedCount = COUNT;

if (timeSinceCounterStart > monthInMilliseconds) {
    updatedStartAt = Date.now();
    updatedCount = 0;
}

const maxEstimatedApiCalls = (images.length - 1) * targetImageSizes.length;
const numFreeApiCalls = 500 - updatedCount;
const nextFreeMonthStart = new Date(START_AT + monthInMilliseconds);

console.log('\nOptimizing images...\n');

if (maxEstimatedApiCalls > numFreeApiCalls) {
    console.log(`Exit process because number of estimated api calls (${maxEstimatedApiCalls}) exceeds number of free api calls (${numFreeApiCalls}) left before ${nextFreeMonthStart}\n`);
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
                    if (fileName === targetDirectoryName) {
                        return;
                    }
                    console.log(`Type of ${fileName} is not supported.`);
                });
        }
        return Promise.all(
            targetImageSizes.map(imageSize => {
                const targetName = `${imageName}_${imageSize.width}_${imageSize.ratio}.${imageType}`;
                if (optimizedImages.includes(targetName)) {
                    return Promise.resolve()
                        .then(() => console.log(`Optimized image ${targetName} already exists.`));
                }
                const options = {};
                switch (imageSize.ratio) {
                    case TargetImageRatios.DEFAULT:
                        options.method = 'scale';
                        options.width = imageSize.width;
                        break;
                    case TargetImageRatios.PORTRAIT:
                        options.method = 'cover';
                        options.width = imageSize.width;
                        options.height = imageSize.height;
                        break;
                    default:
                }
                return tinify
                    .fromFile(path.join(imageDirectory, fileName))
                    .resize(options)
                    .toFile(path.join(targetDirectory, targetName))
                    .then(() => {
                        apiCalls += 2;
                        console.log(`Saved optimized image ${targetName}`);
                    });
            })
        );
    })
)
    .then(() => {
        console.log('\nDone.');
        updatedCount += apiCalls;
        const updatedOptimizationCount = {
            START_AT: updatedStartAt,
            COUNT: updatedCount
        };
        const countStorage = path.resolve('generator', 'statistics', 'optimizationCount.json');
        fs.writeFileSync(countStorage, JSON.stringify(updatedOptimizationCount, null, 4));
        console.log(`\nYou have ${500 - updatedCount} api calls left until ${nextFreeMonthStart}\n`);
    })
    .catch(console.error);
