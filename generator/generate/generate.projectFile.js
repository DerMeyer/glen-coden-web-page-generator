const path = require('path');
const fs = require('fs');
const componentsList = require('../components-list');

function generateProjectFile(projectDir, targetDir) {
    const PROJ_CONFIG = require(path.join(projectDir, 'config'));
    const componentsMap = PROJ_CONFIG.components;

    return new Promise(resolve => {
        let file = `import React from 'react';\n\n`;

        listProjectComponents(componentsMap)
            .reduce((result, component) => {
                if (!result.includes(component)) {
                    return [...result, component];
                }
                return result;
            }, [])
            .forEach(component => {
            if (!componentsList[component]) {
                console.warn(`Couldn't find component with name ${component}. Exit Process.\n`);
                process.exit();
            }
            file += `import ${component} from '${componentsList[component].srcImportPath}';\n`
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

module.exports = generateProjectFile;