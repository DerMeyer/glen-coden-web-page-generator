const path = require('path');
const fs = require('fs');
const generatorConfig = require('../generator-config');

function createManifestJson(projectDir, targetDir) {
    const config = require(path.join(projectDir, 'config'));

    return new Promise(resolve => {
        const availableFiles = fs
            .readdirSync(path.join(projectDir, 'static'))
            .filter(entry => !fs.statSync(path.join(projectDir, 'static', entry)).isDirectory());

        const icons = generatorConfig.icons.filter(icon => availableFiles.includes(icon.src));

        const manifest = {
            name: config.title,
            icons,
            start_url: '.',
            display: 'standalone',
            theme_color: config.app.style.themeColor,
            background_color: config.app.style.backgroundColor
        };

        fs.writeFileSync(path.join(targetDir, 'manifest.json'), JSON.stringify(manifest, null, 4));
        resolve();
    });
}

module.exports = createManifestJson;