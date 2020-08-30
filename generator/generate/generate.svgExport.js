const path = require('path');
const fs = require('fs');
const GEN_CONFIG = require('../../generator-config.json');

function generateSvgExport(sourceDir) {
    return new Promise(resolve => {
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