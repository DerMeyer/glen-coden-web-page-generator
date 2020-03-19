const path = require('path');
const fs = require('fs');
const shortid = require('shortid');
const { objectFromSchema, mergeObjectIntoBlueprint } = require('../js/helpers');

const GEN_CONFIG = require('../generator-config');
const PROJ_CONFIG_SCHEMA = require('../project-config-schema');

function updateProjectConfig(sourceDir, projectDir, projectName) {
    return new Promise(resolve => {
        const sourceConfigPath = path.join(sourceDir, 'project-config.json');
        const sourceConfigIsTruth = fs.existsSync(sourceConfigPath) && projectName === GEN_CONFIG._project;

        let projectConfig;

        if (sourceConfigIsTruth) {
            projectConfig = mergeObjectIntoBlueprint(require(sourceConfigPath), objectFromSchema(PROJ_CONFIG_SCHEMA));
        } else {
            projectConfig = require(path.join(projectDir, 'config'));
        }

        projectConfig.global.style.fontTypes = projectConfig.fontTypes.map(entry => entry.name);
        projectConfig.components = updateComponentsMap(projectConfig.components);
        writeProjectConfig(sourceDir, projectDir, projectConfig);
        resolve();
    });
}

function writeProjectConfig(sourceDir, projectDir, config) {
    const historyDir = path.join(projectDir, 'json', 'config-history');
    const currentEntry = `${new Date()}.json`.split(' ').join('_');
    const historyEntries = fs.readdirSync(historyDir);
    while (historyEntries.length > 50) {
        const obsoleteEntry = historyEntries.reverse().pop();
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
    const generalSchema = objectFromSchema(PROJ_CONFIG_SCHEMA.definitions.single_component);
    const specificSchemaPath = path.join(componentsList[entry.component].path, `${entry.component}.schema.json`);
    const specificSchema = fs.existsSync(specificSchemaPath)
        ? objectFromSchema(JSON.parse(fs.readFileSync(specificSchemaPath, 'utf-8')))
        : {};
    const { children, ...result } = {
        ...generalSchema,
        ...specificSchema,
        ...entry,
        id: shortid.generate()
    };
    const updatedChildren = entry.children
        ? entry.children.map(child => createComponent(child))
        : children;
    return {
        ...result,
        children: updatedChildren
    };
}

module.exports = updateProjectConfig;