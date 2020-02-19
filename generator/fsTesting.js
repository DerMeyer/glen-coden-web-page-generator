const path = require('path');
const fs = require('fs');

const someFile = fs.readFileSync(path.resolve('generator', 'optimizeImages.js'), 'utf-8');

fs.writeFileSync(path.resolve('public', 'someNewFile.js'), someFile);