const path = require('path');
const fs = require('fs');

function updateComponentsList(sourceDir, targetDir) {
    return new Promise(resolve => {
        const componentsList = findComponents(sourceDir, '', 'components');
        fs.writeFileSync(path.join(targetDir, 'components-list.json'), JSON.stringify(componentsList, null, 4));
        resolve();
    });
}

function findComponents(sourceDir, currentPath, currentEntry) {
    const currentEntryPath = path.join(sourceDir, currentPath, currentEntry);
    return fs.readdirSync(currentEntryPath)
        .reduce((result, entry) => {
            if (entry === `${currentEntry}.schema.json`) {
                return {
                    ...result,
                    [currentEntry]: {
                        path: currentEntryPath,
                        srcImportPath: `./${currentPath}/${currentEntry}/${currentEntry}`
                    }
                };
            }
            const entryPath = path.join(currentEntryPath, entry);
            if (fs.statSync(entryPath).isDirectory()) {
                return {
                    ...result,
                    ...findComponents(sourceDir, path.join(currentPath, currentEntry), entry)
                };
            }
            return result;
        }, {});
}

module.exports = updateComponentsList;