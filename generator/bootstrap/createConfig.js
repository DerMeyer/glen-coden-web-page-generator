const path = require('path');
const fs = require('fs');
const { objectFromSchema, mergeObjectIntoBlueprint } = require('../js/helpers');

const bootstrapConfig = require('../bootstrap-config');
const projectConfigSchema = require('../project-config-schema');

function createConfig(projectDir) {
    return new Promise(resolve => {
        const projectConfig = mergeObjectIntoBlueprint(bootstrapConfig.projectConfig, objectFromSchema(projectConfigSchema));
        fs.writeFileSync(path.join(projectDir, 'config.json'), JSON.stringify(projectConfig, null, 4));
        resolve();
    });
}

module.exports = createConfig;