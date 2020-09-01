const path = require('path');
const fs = require('fs');
const shortid = require('shortid');
const { objectFromSchema, mergeObjects } = require('../../js/helpers');
const { get, post } = require('../../js/requests');

const PROJ_CONFIG_SCHEMA = require('../project-config-schema');
const PROJ_INFO = require('../../src/project-info.json');

function updateProjectConfig(sourceDir, projectDir, projectName) {
    return Promise.resolve()
        .then(() => getProjectConfig(sourceDir, projectName))
        .then(config => {
            const jsConfig = typeof config === 'string' ? JSON.parse(config) : config;
            const updatedConfig = mergeObjects(jsConfig, objectFromSchema(PROJ_CONFIG_SCHEMA));

            updatedConfig.components = updateComponentsMap(updatedConfig.components);
            updatedConfig._lastUpdated = new Date().toISOString();

            updateDevProjectConfig(sourceDir, updatedConfig);
            updateConfigHistory(projectDir, updatedConfig);

            return updateRemoteProjectConfig(projectName, updatedConfig);
        });
}

function getProjectConfig(sourceDir, projectName) {
    return Promise.resolve()
        .then(() => {
            if (projectName !== PROJ_INFO.projectName) {
                return get(`http://116.202.99.153/api/config/${projectName}`);
            } else {
                return Promise.resolve(
                    JSON.parse(fs.readFileSync(path.join(sourceDir, 'dev-project-config.json'), 'utf-8'))
                );
            }
        })
}

function updateRemoteProjectConfig(projectName, config) {
    return post(`http://116.202.99.153/api/config/${projectName}`, { config });
}

function updateDevProjectConfig(sourceDir, config) {
    fs.writeFileSync(path.join(sourceDir, 'dev-project-config.json'), JSON.stringify(config, null, 4));
}

function updateConfigHistory(projectDir, config) {
    const historyDir = path.join(projectDir, 'json', 'config-history');
    const date = new Date();
    const currentEntry = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_${date.getHours()}-${date.getSeconds()}.json`;
    const historyEntries = fs.readdirSync(historyDir).reverse();
    while (historyEntries.length > 50) {
        const obsoleteEntry = historyEntries.pop();
        fs.unlinkSync(path.join(historyDir, obsoleteEntry));
    }
    fs.writeFileSync(path.join(historyDir, currentEntry), JSON.stringify(config, null, 4));
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