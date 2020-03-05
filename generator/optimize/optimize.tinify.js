const tinify = require('tinify');
const { TINIFY_API_KEY } = require('../../confidential');
tinify.key = TINIFY_API_KEY;

function optimizeTinify(source, target, options) {
    return tinify
        .fromFile(source)
        .resize(options)
        .toFile(target);
}

module.exports = optimizeTinify;