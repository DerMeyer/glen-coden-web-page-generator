const fs = require('fs');

const { hasFreeApiCalls, addCallCount } = require('../statistics/tinifyApi/manageCallCount');
const optimizeTinify = require('./optimize.tinify');

function optimizeSingleAsset(filePath) {
    return new Promise(resolve => {
        if (!fs.existsSync(filePath)) {
            console.log(`\nCouldn't find file in ${filePath}.\n`);
            process.exit();
        }

        if (!hasFreeApiCalls(2)) {
            process.exit();
        }

        optimizeTinify(filePath, filePath, {}, false)
            .then(() => {
                console.log(`Saved optimized image ${filePath}`);
                addCallCount(2);
                resolve();
            })
    });
}

module.exports = optimizeSingleAsset;