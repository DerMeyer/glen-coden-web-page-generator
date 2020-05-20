export function createImageFileName(source, options) {
    const parts = source.split('.');
    const type = parts.pop();
    const name = parts.join('.');
    return `${name}_${options.method}_w${options.width}${options.height ? `_h${options.height}` : ''}.${type}`;
}

export function getImagePath(segments, name = '') {
    const pathSegments = [ ...segments ];
    let result = '';
    const staticDirIndex = pathSegments.indexOf('static');
    const imagePath = pathSegments.splice(staticDirIndex + 1);
    imagePath.forEach(entry => result += `${entry}/`);
    result += name;
    return result;
}