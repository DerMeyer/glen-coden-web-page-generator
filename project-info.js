const logger = require('./js/logger/logger');
const projectInfo = require('./src/project-info.json');


logger.print(`Name: ${projectInfo.projectName}`, true, true);