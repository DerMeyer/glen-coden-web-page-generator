const path = require('path');
const fs = require('fs');

const tinify = require('tinify');
const { PROJECTS_PATH_SEGMENTS, TINIFY_API_KEY } = require('../confidential');
tinify.key = TINIFY_API_KEY;

const generatorConfig = require('./generator-config');
const supportedImageTypes = generatorConfig.imageTypesForOptimization;
const { targetImageSizes } = require('../src/js/generated');

const projectsDir = path.resolve(...PROJECTS_PATH_SEGMENTS);

let projectName = process.argv[2];

if (!projectName) {
    projectName = generatorConfig._project;
}

if (!fs.readdirSync(projectsDir).includes(projectName)) {
    console.warn(`\nCouldn't find project with name ${projectName}. Exit process.\n`);
    process.exit();
}

const imageDir = path.join(projectsDir, projectName, 'static', 'images');
const targetDirName = 'optimized';
const targetDir = path.join(imageDir, targetDirName);

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir);
}

const images = fs.readdirSync(imageDir).filter(fileName => !generatorConfig.ignore.includes(fileName));
const previousOptimized = fs.readdirSync(targetDir);

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
        console.log('\nDone.');
        updatedCount += apiCalls;
        const updatedOptimizationCount = {
            START_AT: updatedStartAt,
            COUNT: updatedCount
        };
        const countStorage = path.resolve('generator', 'statistics', 'tinifyApiCallCount.json');
        fs.writeFileSync(countStorage, JSON.stringify(updatedOptimizationCount, null, 4));
        console.log(`\nYou have ${500 - updatedCount} api calls left until ${nextFreeMonthStart}\n`);
    })
    .catch(console.error);
