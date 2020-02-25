const path = require('path');
const fs = require('fs');
const { mergeObjectIntoBlueprint } = require('../helpers');
const getPath = require('../getters/getPath');

const configPath = path.join(getPath.generatorDir, 'generator-config.json');
const config = require(configPath);

const setConfig = function(params) {
    const updatedConfig = mergeObjectIntoBlueprint(params, config);
    fs.writeFileSync(configPath, JSON.stringify(updatedConfig, null, 4));
};

module.exports = setConfig;