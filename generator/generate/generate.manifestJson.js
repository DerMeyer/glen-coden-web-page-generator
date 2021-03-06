const path = require('path');
const fs = require('fs');

function generateManifestJson(sourceDir, projectDir, targetDir) {
    const PROJ_CONFIG = require(path.join(sourceDir, '_config'));

    return new Promise(resolve => {
        const availableFiles = fs
            .readdirSync(path.join(projectDir, 'static'))
            .filter(e => !fs.statSync(path.join(projectDir, 'static', e)).isDirectory());

        const icons = [
            {
                src: 'favicon.png',
                type: "image/png",
                sizes: '32x32'
            },
            {
                src: 'logo64.png',
                type: "image/png",
                sizes: '64x64'
            },
            {
                src: 'logo192.png',
                type: "image/png",
                sizes: '192x192'
            },
            {
                src: 'logo512.png',
                type: "image/png",
                sizes: '512x512'
            }
        ]
            .filter(e => availableFiles.includes(e.src));

        const manifest = {
            name: PROJ_CONFIG.title,
            icons,
            start_url: '.',
            display: 'standalone',
            theme_color: PROJ_CONFIG.theme.colors[PROJ_CONFIG.global.bg],
            background_color: PROJ_CONFIG.theme.colors[PROJ_CONFIG.global.bg]
        };

        fs.writeFileSync(path.join(targetDir, 'manifest.json'), JSON.stringify(manifest, null, 4));
        resolve();
    });
}

module.exports = generateManifestJson;