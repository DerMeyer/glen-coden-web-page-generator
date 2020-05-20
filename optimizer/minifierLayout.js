const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const minify = require('./minify');
const { hasFreeApiCalls, addCallCount } = require('./statistics/tinifyApi/manageCallCount');

function minifierLayout(dir, assets, sizes) {
    return new Promise(resolve => {
        if (!hasFreeApiCalls(assets.length * sizes.length * 2)) {
            process.exit();
        }
        let apiCalls = 0;
        Promise.all(
            assets.map(
                asset => Promise.all(
                    sizes.map(width => {
                        const targetDir = path.join(dir, `${width}px`);
                        if (!fs.existsSync(targetDir)) {
                            fs.mkdirSync(targetDir);
                        }
                        return new Promise(resolve => rimraf(path.join(targetDir, '*'), resolve))
                            .then(() => {
                                const source = path.join(dir, asset);
                                const target = path.join(targetDir, asset);
                                const options = {
                                    method: 'scale',
                                    width
                                };
                                return minify(source, target, options)
                                    .then(() => {
                                        apiCalls += 2;
                                        console.log(`Saved optimized asset ${targetDir}/${asset}`);
                                    });
                            });
                    })
                )
            )
        )
            .then(() => {
                addCallCount(apiCalls);
                resolve();
            });
    });
}

module.exports = minifierLayout;