const path = require('path');
const fs = require('fs');
const shortid = require('shortid');
const { objectFromSchema } = require('../js/helpers');
const generatorConfig = require('../generator-config');

const configSchema = require('../project-config-schema');
const componentsList = require('../components-list');

function updateAppConfig(sourceDir, projectDir) {
    return new Promise(resolve => {
        const appConfig = require(path.join(sourceDir, 'app-config'));
        const projectConfig = require(path.join(projectDir, 'config'));
        const appConfigIsTruth = appConfig && generatorConfig._project === generatorConfig._lastGenerated;
        const componentsMap = appConfigIsTruth
            ? appConfig.components
            : projectConfig.app.components;
        const updatedComponentsMap = updateMap(componentsMap);
        if (appConfigIsTruth) {
            console.log('APP IS TRUTH');// TODO remove dev code
            appConfig.components = updatedComponentsMap;
            projectConfig.app = appConfig;
            fs.writeFileSync(path.join(sourceDir, 'app-config.json'), JSON.stringify(appConfig, null, 4));
            fs.writeFileSync(path.join(projectDir, 'config.json'), JSON.stringify(projectConfig, null, 4));
            resolve();
            return;
        }
        console.log('NOW WE NEVER GET HERE');// TODO remove dev code
        projectConfig.app.components = updatedComponentsMap;
        fs.writeFileSync(path.join(projectDir, 'config.json'), JSON.stringify(projectConfig, null, 4));
        resolve();
    });
}

function updateMap(componentsMap) {
    return [ ...componentsMap ].map(entry => {
        if (!entry.id) {
            return createComponent(entry);
        }
        return {
            ...entry,
            children: updateMap(entry.children)
        };
    });
}

function createComponent(entry) {
    if (entry.id) {
        return entry;
    }
    const generalSchema = objectFromSchema(configSchema.definitions.single_component);
    const specificSchemaPath = path.join(componentsList[entry.component].path, 'schema.json');
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

module.exports = updateAppConfig;