const path = require('path');
const fs = require('fs');

function createProjectFile(projectDir, targetDir) {
    const config = require(path.join(projectDir, 'config'));
    const structure = config.structure;

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
        listProjectComponents(structure).forEach(component => {
            if (!importPaths[component]) {
                console.warn(`Couldn't find component with name ${component}. Exit Process.\n`);
                process.exit();
            }
            file += `import ${component} from '${importPaths[component]}';\n`
        });
        file += '\n\nexport default function _Project() {\n\treturn (\n\t\t<>\n';
        file += createJsx(structure, 3);
        file += '\t\t</>\n\t);\n}\n';

        fs.writeFileSync(path.join(targetDir, '_Project.js'), file);
        resolve();
    });
}

function listProjectComponents(structure) {
    const list = [];
    Object.keys(structure).forEach(key => {
        list.push(key);
        listProjectComponents(structure[key]).forEach(element => {
            list.push(element);
        });
    });
    return list.reduce((result, element) => {
        if (!result.includes(element)) {
            return [...result, element];
        }
        return result;
    }, []);
}

function createJsx(structure, depth, level = []) {
    let jsx = '';
    Object.keys(structure).forEach(key => {
        if (Object.keys(structure[key]).length === 0) {
            jsx += `${'\t'.repeat(depth)}<${key} level={[${level.reduce((result, entry, index) => result + `${index ? ', ' : ''}'${entry}'`, '')}]} />\n`;
        } else {
            jsx += `${'\t'.repeat(depth)}<${key} level={[${level.reduce((result, entry, index) => result + `${index ? ', ' : ''}'${entry}'`, '')}]}>\n`;
            jsx += createJsx(structure[key], depth + 1, [...level, key]);
            jsx += `${'\t'.repeat(depth)}</${key}>\n`;
        }
    });
    return jsx;
}

module.exports = createProjectFile;