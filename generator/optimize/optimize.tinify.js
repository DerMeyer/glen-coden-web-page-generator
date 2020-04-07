const tinify = require('tinify');
const { TINIFY_API_KEY } = require('../../confidential');
tinify.key = TINIFY_API_KEY;

function optimizeTinify(source, target, options, doResize = true) {
    return doResize
        ? tinify
            .fromFile(source)
            .resize(options)
            .toFile(target)
        : tinify
            .fromFile(source)
            .toFile(target);
}

module.exports = optimizeTinify;