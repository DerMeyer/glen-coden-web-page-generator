function createImageFileName(source, options) {
    const parts = source.split('.');
    const type = parts.pop();
    const name = parts.join('.');
    return `${name}_${options.method}_w${options.width}${options.height ? `_h${options.height}` : ''}.${type}`;
}

function getImagePath(name, targetPath) {
    let result = '';
    const staticDirIndex = targetPath.indexOf('static');
    const imagePath = targetPath.splice(staticDirIndex + 1);
    imagePath.forEach(entry => result += `${entry}/`);
    result += name;
    return result;
}

exports.createImageFileName = createImageFileName;
exports.getImagePath = getImagePath;