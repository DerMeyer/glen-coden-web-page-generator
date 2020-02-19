const path = require('path');
const fs = require('fs');

function createIndexHtml(projectDir, targetDir) {
    const config = require(path.join(projectDir, 'config'));

    return new Promise(resolve => {
        let file = '';
        file += '<!DOCTYPE html>';
        file += '\n<html lang="en">';
        file += '\n<head>';
        file += '\n\t<meta charset="utf-8" />';
        file += '\n\t<meta name="viewport" content="width=device-width, initial-scale=1" />';
        file += '\n\t<meta name="theme-color" content="#000000" />';
        file += '\n\t<meta name="description" content="Web site created using create-react-app"/>';
        file += '\n\t<link rel="icon" href="%PUBLIC_URL%/favicon.png" />';
        file += '\n\t<link rel="manifest" href="%PUBLIC_URL%/manifest.json" />';
        file += '\n\t<link href="https://fonts.googleapis.com/css?family=Comfortaa&display=swap" rel="stylesheet">';
        file += `\n\t<title>${config.title}</title>`;
        file += '\n</head>';
        file += '\n<body>';
        file += '\n\t<div id="root"></div>';
        file += '\n</body>';
        file += '\n</html>';

        fs.writeFileSync(path.join(targetDir, 'index.html'), file);
        resolve();
    });
}

module.exports = createIndexHtml;