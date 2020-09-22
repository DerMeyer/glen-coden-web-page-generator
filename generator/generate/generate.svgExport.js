const path = require('path');
const rimraf = require('rimraf');
const fs = require('fs');
const { deepCopyDirectory } = require('../../js/helpers');
const GEN_CONFIG = require('../../generator-config.json');

function generateSvgExport(sourceDir, projectDir, projectName) {
    return new Promise(resolve => {
        rimraf(path.join(sourceDir, 'svg', '*'), () => {
            deepCopyDirectory(path.join(projectDir, projectName, 'svg'), path.join(sourceDir, 'svg'));
        });

        const svgList = fs.readdirSync(path.join(sourceDir, 'svg')).filter(fileName => !GEN_CONFIG.ignore.includes(fileName));

        let file = '';

        svgList.forEach((fileName, index) => {
            const svgName = fileName.split('.')[0];
            const [firstLetter, ...restOfWord] = svgName;
            file += `${index ? '\n' : ''}export {ReactComponent as ${firstLetter.toUpperCase()}${restOfWord.join('')}} from '../svg/${fileName}';`;
        });

        fs.writeFileSync(path.join(sourceDir, 'js', 'svgExports.js'), file);
        resolve();
    });
}

module.exports = generateSvgExport;