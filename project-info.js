const logger = require('./js/logger');
const projectInfo = require('./src/project-info.json');


logger.print(`Name: ${projectInfo.projectName}`, true, true);