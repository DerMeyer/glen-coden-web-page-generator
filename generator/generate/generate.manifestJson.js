const path = require('path');
const fs = require('fs');
const CONFIG = require('../generator-config');

function generateManifestJson(projectDir, targetDir) {
    const PROJECT_CONFIG = require(path.join(projectDir, 'config'));

    return new Promise(resolve => {
        const availableFiles = fs
            .readdirSync(path.join(projectDir, 'static'))
            .filter(entry => !fs.statSync(path.join(projectDir, 'static', entry)).isDirectory());

        const icons = CONFIG.icons.filter(icon => availableFiles.includes(icon.src));

        const manifest = {
            name: PROJECT_CONFIG.title,
            icons,
            start_url: '.',
            display: 'standalone',
            theme_color: PROJECT_CONFIG.app.style.themeColor,
            background_color: PROJECT_CONFIG.app.style.backgroundColor
        };

        fs.writeFileSync(path.join(targetDir, 'manifest.json'), JSON.stringify(manifest, null, 4));
        resolve();
    });
}

module.exports = generateManifestJson;