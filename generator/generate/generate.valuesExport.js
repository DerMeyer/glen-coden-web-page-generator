const path = require('path');
const fs = require('fs');
const GEN_CONFIG = require('../generator-config');
const { isObject } = require('../js/helpers');

function generateValuesExport(sourceDir) {
    return new Promise(resolve => {
        let file = '';

        Object.keys(GEN_CONFIG)
            .filter(key => GEN_CONFIG.exposedValues.includes(key))
            .forEach((key, index) => {
                file += `${index ? '\n' : ''}exports.${key} = `;
                file += stringifyJS(GEN_CONFIG[key]);
                file += '\n';
            });

        fs.writeFileSync(path.join(sourceDir, 'js', 'generated.js'), file);
        resolve();
    });
}

function stringifyJS(value, depth = 0, last = false) {
    let result = '';
    if (isObject(value)) {
        const keys = Object.keys(value);
        if (!keys.length) {
            return '{}';
        }
        result += `{\n`;
        keys.forEach((key, index) => {
            result += `${'\t'.repeat(depth + 1)}${key}: `;
            result += stringifyJS(value[key], depth + 1, index === keys.length - 1);
            result += '\n';
        });
        result += `${'\t'.repeat(depth)}}${depth ? (last ? '' : ',') : ';'}`;
    } else if (Array.isArray(value)) {
        if (!value.length) {
            return '[]';
        }
        result += `[\n`;
        value.forEach((element, index) => {
            result += `${'\t'.repeat(depth + 1)}`;
            result += stringifyJS(element, depth + 1, index === value.length - 1);
            result += '\n';
        });
        result += `${'\t'.repeat(depth)}]${depth ? (last ? '' : ',') : ';'}`;
    } else if (typeof value === 'string') {
        return `'${value}'${depth ? (last ? '' : ',') : ';'}`;
    } else {
        return `${value}${depth ? (last ? '' : ',') : ';'}`;
    }
    return result;
}

module.exports = generateValuesExport;