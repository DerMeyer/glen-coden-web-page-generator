const path = require('path');
const fs = require('fs');
const { objectFromSchema, mergeObjectIntoBlueprint } = require('../js/helpers');

const CONFIG = require('../bootstrap-config');
const CONFIG_SCHEMA = require('../project-config-schema');

function bootstrapConfig(projectDir) {
    return new Promise(resolve => {
        const projectConfig = mergeObjectIntoBlueprint(CONFIG.projectConfig, objectFromSchema(CONFIG_SCHEMA));
        fs.writeFileSync(path.join(projectDir, 'config.json'), JSON.stringify(projectConfig, null, 4));
        resolve();
    });
}

module.exports = bootstrapConfig;