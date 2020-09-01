 const path = require('path');
const fs = require('fs');

function generateIndexHtml(sourceDir, targetDir) {
    const PROJ_CONFIG = require(path.join(sourceDir, 'dev-project-config'));

    return new Promise(resolve => {
        let file = '';
        file += '<!DOCTYPE html>';
        file += '\n<html lang="en">';
        file += '\n<head>';
        file += '\n\t<meta charset="utf-8" />';
        file += '\n\t<meta name="viewport" content="width=device-width, initial-scale=1" />';
        file += `\n\t<meta name="theme-color" content="${PROJ_CONFIG.global.themeColor}" />`;
        file += `\n\t<meta name="description" content="${PROJ_CONFIG.description}"/>`;
        file += '\n\t<link rel="icon" href="%PUBLIC_URL%/favicon.png" />';
        file += '\n\t<link rel="manifest" href="%PUBLIC_URL%/manifest.json" />';
        PROJ_CONFIG.global.fontTypes.forEach(fontType => {
            if (!fontType.url) {
                return;
            }
            file += `\n\t<link href="${fontType.url}" rel="stylesheet">`
        });
        file += `\n\t<title>${PROJ_CONFIG.title}</title>`;
        file += '\n</head>';
        file += '\n<body>';
        file += '\n\t<div id="root"></div>';
        file += '\n</body>';
        file += '\n</html>';

        fs.writeFileSync(path.join(targetDir, 'index.html'), file);
        resolve();
    });
}

module.exports = generateIndexHtml;