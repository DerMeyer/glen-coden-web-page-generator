const path = require('path');
const fs = require('fs');
const { objectFromSchema, mergeObjectIntoBlueprint } = require('../js/helpers');

const BOOTSTRAP_CONFIG = require('../bootstrap-config');
const PROJ_CONFIG_SCHEMA = require('../project-config-schema');

function bootstrapConfig(projectDir) {
    return new Promise(resolve => {
        const projectConfig = mergeObjectIntoBlueprint(BOOTSTRAP_CONFIG.projectConfig, objectFromSchema(PROJ_CONFIG_SCHEMA));
        fs.writeFileSync(path.join(projectDir, 'config.json'), JSON.stringify(projectConfig, null, 4));
        resolve();
    });
}

module.exports = bootstrapConfig;