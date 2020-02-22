const path = require('path');
const fs = require('fs');
const generatorConfig = require('../generator-config');
const { isObject } = require('../js/helpers');

function createValuesExport(targetDir) {
    return new Promise(resolve => {
        const { values } = generatorConfig;
        let file = '';

        Object.keys(values).forEach((key, index) => {
            file += `${index ? '\n' : ''}exports.${key} = `;
            file += stringifyJS(values[key]);
            file += '\n';
        });

        fs.writeFileSync(path.join(targetDir, 'js', 'generated.js'), file);
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
        result += `${'\t'.repeat(depth)}{\n`;
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
        result += `${'\t'.repeat(depth)}[\n`;
        value.forEach((element, index) => {
            result += stringifyJS(element, depth + 1, index === value.length - 1);
            result += '\n';
        });
        result += `${'\t'.repeat(depth)}]${depth ? (last ? '' : ',') : ';'}`;
    } else if (typeof value === 'string') {
        return `'${value}'${depth ? (last ? '' : ',') : ';'}`;
    } else {
        return `${value}${depth ? (last ? '' : ',') : ';'}`;
    }
    if (result.length < 80) {
        const regexNewline = new RegExp('\\n', 'gm');
        const regexTab = new RegExp('\\t+', 'gm');
        const oneLineResult = result
            .replace(regexNewline, '')
            .replace(regexTab, ' ');
        return '\t'.repeat(depth) + oneLineResult.trim();
    }
    return result;
}

module.exports = createValuesExport;