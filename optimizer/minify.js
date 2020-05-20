const tinify = require('tinify');
const { TINIFY_API_KEY } = require('../confidential.json');
tinify.key = TINIFY_API_KEY;

function minify(source, target, resizeOptions) {
    return resizeOptions
        ? tinify
            .fromFile(source)
            .resize(resizeOptions)
            .toFile(target)
        : tinify
            .fromFile(source)
            .toFile(target);
}

module.exports = minify;