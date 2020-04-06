const path = require('path');
const fs = require('fs');
const GEN_CONFIG = require('../generator-config');

function generateManifestJson(projectDir, targetDir) {
    const PROJ_CONFIG = require(path.join(projectDir, 'config'));

    return new Promise(resolve => {
        const availableFiles = fs
            .readdirSync(path.join(projectDir, 'static'))
            .filter(entry => !fs.statSync(path.join(projectDir, 'static', entry)).isDirectory());

        const icons = GEN_CONFIG.icons.filter(icon => availableFiles.includes(icon.src));

        const manifest = {
            name: PROJ_CONFIG.title,
            icons,
            start_url: '.',
            display: 'standalone',
            theme_color: PROJ_CONFIG.global.themeColor,
            background_color: PROJ_CONFIG.global.backgroundColor
        };

        fs.writeFileSync(path.join(targetDir, 'manifest.json'), JSON.stringify(manifest, null, 4));
        resolve();
    });
}

module.exports = generateManifestJson;