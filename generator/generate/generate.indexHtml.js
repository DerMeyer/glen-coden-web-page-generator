const path = require('path');
const fs = require('fs');

function generateIndexHtml(projectDir, targetDir) {
    const PROJECT_CONFIG = require(path.join(projectDir, 'config'));

    return new Promise(resolve => {
        let file = '';
        file += '<!DOCTYPE html>';
        file += '\n<html lang="en">';
        file += '\n<head>';
        file += '\n\t<meta charset="utf-8" />';
        file += '\n\t<meta name="viewport" content="width=device-width, initial-scale=1" />';
        file += `\n\t<meta name="theme-color" content="${PROJECT_CONFIG.app.style.themeColor}" />`;
        file += `\n\t<meta name="description" content="${PROJECT_CONFIG.description}"/>`;
        file += '\n\t<link rel="icon" href="%PUBLIC_URL%/favicon.png" />';
        file += '\n\t<link rel="manifest" href="%PUBLIC_URL%/manifest.json" />';
        PROJECT_CONFIG.fontTypes.forEach(fontType => file += `\n\t<link href="${fontType}" rel="stylesheet">`);
        file += `\n\t<title>${PROJECT_CONFIG.title}</title>`;
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