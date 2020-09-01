const path = require('path');
const fs = require('fs');

function generateProjectInfo(sourceDir, projectName) {
    return new Promise(resolve => {
        const projectInfo = { projectName };
        fs.writeFileSync(path.join(sourceDir, 'project-info.json'), JSON.stringify(projectInfo, null, 4));
        resolve();
    });
}

module.exports = generateProjectInfo;