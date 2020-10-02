const path = require('path');
const fs = require('fs');
const componentsList = require('../components-list');

function generateProjectFile(sourceDir, targetDir) {
    const PROJ_CONFIG = require(path.join(sourceDir, '_config'));
    const componentsMap = PROJ_CONFIG.components;

    return new Promise(resolve => {
        let file = '';
        file += `import React from 'react';\n`
        file += `import { configService } from './index';\n\n`

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
        file += '\n\nexport default function _Project() {\n';
        file += '\tconst { getProps } = configService;\n';
        file += '\treturn (\n\t\t<>\n';
        file += createJsx(componentsMap, 3);
        file += '\t\t</>\n\t);\n';
        file += '}\n';

        fs.writeFileSync(path.join(targetDir, '_Project.js'), file);
        resolve();
    });
}

function listProjectComponents(componentsMap) {
    const list = [];
    componentsMap.forEach(entry => {
        if (typeof entry === 'string') {
            return;
        }
        list.push(entry.component);
        if (entry.children) {
            listProjectComponents(entry.children).forEach(child => {
                list.push(child);
            });
        }
    });
    return list;
}

function createJsx(componentsMap, depth) {
    let jsx = '';
    componentsMap.forEach(entry => {
        if (typeof entry === 'string') {
            jsx += `${'\t'.repeat(depth)}${entry}\n`;
        } else if (!entry.children || entry.children.length === 0) {
            jsx += `${'\t'.repeat(depth)}<${entry.component} {...getProps('${entry.id}')} />\n`;
        } else {
            jsx += `${'\t'.repeat(depth)}<${entry.component} {...getProps('${entry.id}')}>\n`;
            jsx += createJsx(entry.children, depth + 1);
            jsx += `${'\t'.repeat(depth)}</${entry.component}>\n`;
        }
    });
    return jsx;
}

module.exports = generateProjectFile;