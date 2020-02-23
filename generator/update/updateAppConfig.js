const path = require('path');
const fs = require('fs');
const shortid = require('shortid');
const { objectFromSchema, mergeObjectIntoBlueprint } = require('../js/helpers');
const generatorConfig = require('../generator-config');

const configSchema = require('../project-config-schema');
const componentsList = require('../components-list');

function updateAppConfig(sourceDir, projectDir) {
    return new Promise(resolve => {
        const projectConfig = require(path.join(projectDir, 'config'));
        const appConfigPath = path.join(sourceDir, 'app-config');
        const appConfigIsTruth = fs.existsSync(path.join(sourceDir, 'app-config.json')) && generatorConfig._project === generatorConfig._lastGenerated;

        if (appConfigIsTruth) {
            const appConfig = mergeObjectIntoBlueprint(require(appConfigPath), objectFromSchema(configSchema).app);
            appConfig.components = updateMap(appConfig.components);
            projectConfig.app = appConfig;
            fs.writeFileSync(path.join(sourceDir, 'app-config.json'), JSON.stringify(appConfig, null, 4));
            fs.writeFileSync(path.join(projectDir, 'config.json'), JSON.stringify(projectConfig, null, 4));
            resolve();
            return;
        }

        projectConfig.app.components = updateMap(projectConfig.app.components);
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