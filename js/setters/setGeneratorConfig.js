const path = require('path');
const fs = require('fs');
const { mergeObjects } = require('../helpers');

const configPath = path.resolve('generator-config.json');
const config = require(configPath);

const setGeneratorConfig = function(params) {
    const updatedConfig = mergeObjects(params, config);
    fs.writeFileSync(configPath, JSON.stringify(updatedConfig, null, 4));
};

module.exports = setGeneratorConfig;