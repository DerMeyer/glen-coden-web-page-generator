const path = require('path');
const fs = require('fs');

function updateComponentsList(sourceDir, componentsDirName, targetDirectories) {
    return new Promise(resolve => {
        const componentsPath = path.join(sourceDir, componentsDirName);
        const componentsList = fs.readdirSync(componentsPath)
            .reduce((result, entry) => {
                const entryPath = path.join(componentsPath, entry);
                if (fs.statSync(entryPath).isDirectory()) {
                    const resultsForEntry = {};
                    const components = fs.readdirSync(entryPath);
                    components.forEach(component => resultsForEntry[component] = {
                        path: path.join(componentsPath, entry, component),
                        srcImportPath: `./${componentsDirName}/${entry}/${component}/${component}`
                    });
                    return {
                        ...result,
                        ...resultsForEntry
                    };
                }
                return result;
            }, {});
        targetDirectories.forEach(targetDir => {
            fs.writeFileSync(path.join(targetDir, 'components-list.json'), JSON.stringify(componentsList, null, 4));
        });
        resolve();
    });
}

module.exports = updateComponentsList;