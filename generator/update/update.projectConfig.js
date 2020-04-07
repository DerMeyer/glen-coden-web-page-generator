const path = require('path');
const fs = require('fs');
const shortid = require('shortid');
const { objectFromSchema, mergeObjects } = require('../js/helpers');

const GEN_CONFIG = require('../generator-config');
const PROJ_CONFIG_SCHEMA = require('../project-config-schema');

function updateProjectConfig(sourceDir, projectDir, projectName) {
    return new Promise(resolve => {
        const sourceConfigPath = path.join(sourceDir, 'project-config.json');
        const sourceConfigIsTruth = fs.existsSync(sourceConfigPath) && projectName === GEN_CONFIG._project;

        let projectConfig;

        if (sourceConfigIsTruth) {
            projectConfig = JSON.parse(fs.readFileSync(sourceConfigPath, 'utf-8'));
        } else {
            projectConfig = JSON.parse(fs.readFileSync(path.join(projectDir, 'config.json'), 'utf-8'));
        }

        const updatedConfig = mergeObjects(projectConfig, objectFromSchema(PROJ_CONFIG_SCHEMA));

        updatedConfig.components = updateComponentsMap(updatedConfig.components);

        writeProjectConfig(sourceDir, projectDir, updatedConfig);
        resolve();
    });
}

function writeProjectConfig(sourceDir, projectDir, config) {
    const historyDir = path.join(projectDir, 'json', 'config-history');
    const date = new Date();
    const currentEntry = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_${date.getHours()}-${date.getSeconds()}.json`;
    const historyEntries = fs.readdirSync(historyDir).reverse();
    while (historyEntries.length > 50) {
        const obsoleteEntry = historyEntries.pop();
        fs.unlinkSync(path.join(historyDir, obsoleteEntry));
    }
    fs.writeFileSync(path.join(sourceDir, 'project-config.json'), JSON.stringify(config, null, 4));
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