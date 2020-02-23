const path = require('path');
const fs = require('fs');
const shortid = require('shortid');
const { objectFromSchema } = require('../js/helpers');

const configSchema = require('../project-config-schema');
const componentsList = require('../components-list');

function updateComponentsMap(projectDir) {
    return new Promise(resolve => {
        const config = require(path.join(projectDir, 'config'));
        config.app.components = updateMap(config.app.components);
        fs.writeFileSync(path.join(projectDir, 'config.json'), JSON.stringify(config, null, 4));
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

module.exports = updateComponentsMap;