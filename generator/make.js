const path = require('path');
const fs = require('fs');
const getPath = require('../js/getters/getPath');
const { execProcess } = require('../js/helpers');
const GEN_CONFIG = require('../generator-config.json');


const projectName = process.argv[2] || GEN_CONFIG._project;

Promise.resolve()
    .then(
        !fs.existsSync(path.resolve(getPath.projectsDir, projectName))
            ? () => execProcess(`yarn bootstrap ${projectName}`)
            : Promise.resolve()
    )
    .then(() => execProcess(`yarn update ${projectName}`))
    .then(() => execProcess(`yarn generate ${projectName}`))
    .catch(console.error);
