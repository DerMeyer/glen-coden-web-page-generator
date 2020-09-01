const path = require('path');
const fs = require('fs');
const getPath = require('../js/getPath');
const { execProcess } = require('../js/helpers');
const PROJ_INFO = require('../src/project-info.json');


const projectName = process.argv[2] || PROJ_INFO.projectName;

Promise.resolve()
    .then(
        !fs.existsSync(path.resolve(getPath.projectsDir, projectName))
            ? () => execProcess(`yarn bootstrap ${projectName}`)
            : Promise.resolve()
    )
    .then(() => execProcess(`yarn update ${projectName}`))
    .then(() => execProcess(`yarn generate ${projectName}`))
    .catch(console.error);
