const { objectFromSchema, mergeObjects } = require('../../js/helpers');
const { post } = require('../../js/requests');
const getPath = require('../../js/getPath');

const BOOTSTRAP_CONFIG = require('../bootstrap-config');
const PROJ_CONFIG_SCHEMA = require('../project-config-schema');

function bootstrapConfig(sourceDir, projectName) {
    return new Promise(resolve => {
        const config = mergeObjects(BOOTSTRAP_CONFIG.projectConfig, objectFromSchema(PROJ_CONFIG_SCHEMA));
        post(`${getPath.api}/config/${projectName}`, { config })
            .then(resolve);
    });
}

module.exports = bootstrapConfig;