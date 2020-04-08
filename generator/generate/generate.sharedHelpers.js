const path = require('path');
const fs = require('fs');

function generateSharedHelpers(generatorDir, sourceDir) {
    return new Promise(resolve => {
        const sharedHelpers = fs.readFileSync(path.join(generatorDir, 'js', 'shared.js'), 'utf-8');
        fs.writeFileSync(path.join(sourceDir, 'js', 'shared.js'), sharedHelpers);
        resolve();
    });
}

module.exports = generateSharedHelpers;