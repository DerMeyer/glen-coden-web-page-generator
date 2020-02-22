const path = require('path');
const fs = require('fs');

function createProjectFile(projectDir, targetDir) {
    const config = require(path.join(projectDir, 'config'));
    const componentsMap = config.project.components;

    return new Promise(resolve => {
        const componentsDir = 'components';
        const componentsPath = path.join(targetDir, componentsDir);
        const importPaths = fs.readdirSync(componentsPath)
            .reduce((result, entry) => {
                const entryPath = path.join(componentsPath, entry);
                if (fs.statSync(entryPath).isDirectory()) {
                    const resultsForEntry = {};
                    const components = fs.readdirSync(entryPath);
                    components.forEach(component => resultsForEntry[component] = `./${componentsDir}/${entry}/${component}/${component}`);
                    return {
                        ...result,
                        ...resultsForEntry
                    };
                }
                return result;
            }, {});

        let file = `import React from 'react';\n\n`;
        listProjectComponents(componentsMap)
            .reduce((result, component) => {
                if (!result.includes(component)) {
                    return [...result, component];
                }
                return result;
            }, [])
            .forEach(component => {
            if (!importPaths[component]) {
                console.warn(`Couldn't find component with name ${component}. Exit Process.\n`);
                process.exit();
            }
            file += `import ${component} from '${importPaths[component]}';\n`
        });
        file += '\n\nexport default function _Project() {\n\treturn (\n\t\t<>\n';
        file += createJsx(componentsMap, 3);
        file += '\t\t</>\n\t);\n}\n';

        fs.writeFileSync(path.join(targetDir, '_Project.js'), file);
        resolve();
    });
}

function listProjectComponents(componentsMap) {
    const list = [];
    componentsMap.forEach(entry => {
        list.push(entry.component);
        listProjectComponents(entry.children).forEach(child => {
            list.push(child);
        });
    });
    return list;
}

function createJsx(componentsMap, depth) {
    let jsx = '';
    componentsMap.forEach(entry => {
        if (entry.children.length === 0) {
            jsx += `${'\t'.repeat(depth)}<${entry.component} id="${entry.id}" />\n`;
        } else {
            jsx += `${'\t'.repeat(depth)}<${entry.component} id="${entry.id}">\n`;
            jsx += createJsx(entry.children, depth + 1);
            jsx += `${'\t'.repeat(depth)}</${entry.component}>\n`;
        }
    });
    return jsx;
}

module.exports = createProjectFile;