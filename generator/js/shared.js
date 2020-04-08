function createImageFileName(source, options) {
    const parts = source.split('.');
    const type = parts.pop();
    const name = parts.join('.');
    return `${name}_${options.method}_w${options.width}${options.height ? `_h${options.height}` : ''}.${type}`;
}

exports.createImageFileName = createImageFileName;