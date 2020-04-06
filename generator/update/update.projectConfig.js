const path = require('path');
const fs = require('fs');
const shortid = require('shortid');
const { objectFromSchema, mergeObjects } = require('../js/helpers');

const PROJ_CONFIG_SCHEMA = require('../project-config-schema');

function updateProjectConfig(projectDir) {
    return new Promise(resolve => {
        const projectConfig = fs.readFileSync(path.join(projectDir, 'config.json'), 'uft-8');
        const updatedConfig = mergeObjects((projectConfig), objectFromSchema(PROJ_CONFIG_SCHEMA));
        updatedConfig.components = updateComponentsMap(updatedConfig.components);
        writeProjectConfig(projectDir, projectConfig);
        resolve();
    });
}

function writeProjectConfig(projectDir, config) {
    const historyDir = path.join(projectDir, 'json', 'config-history');
    const currentEntry = `${new Date()}.json`.split(' ').join('_');
    const historyEntries = fs.readdirSync(historyDir);
    while (historyEntries.length > 50) {
        const obsoleteEntry = historyEntries.reverse().pop();
        fs.unlinkSync(path.join(historyDir, obsoleteEntry));
    }
    fs.writeFileSync(path.join(historyDir, currentEntry), JSON.stringify(config, null, 4));
    fs.writeFileSync(path.join(projectDir, 'config.json'), JSON.stringify(config, null, 4));
}

function updateComponentsMap(componentsMap) {
    return [ ...componentsMap ].map(entry => {
        if (!entry.id) {
            return createComponent(entry);
        }
        return {
            ...entry,
            children: updateComponentsMap(entry.children)
        };
    });
}

function createComponent(entry) {
    if (entry.id) {
        return entry;
    }
    const componentsList = require('../components-list');
    const schemaPath = path.join(componentsList[entry.component].path, `${entry.component}.schema.json`);
    const schema = fs.existsSync(schemaPath)
        ? objectFromSchema(JSON.parse(fs.readFileSync(schemaPath, 'utf-8')))
        : {};
    const { children, ...props} = mergeObjects(entry, schema);
    return {
        component: entry.component,
        id: shortid.generate(),
        ...props,
        children: (children || []).map(child => createComponent(child))
    };
}

module.exports = updateProjectConfig;