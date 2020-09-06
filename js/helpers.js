const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const logger = require('./logger');
const GEN_CONFIG = require('../generator-config.json');


const emptyJsValues = {
    object: {},
    array: [],
    string: '',
    number: 0,
    boolean: false
};

function isObject(value) {
    return value !== null && typeof value !== 'function' && typeof value === 'object' && !Array.isArray(value);
}

function objectFromSchema(schema, defs = null) {
    if (!isObject(schema)) {
        logger.warn('objectFromSchema only generates JavaScript form JavaScript');
        return;
    }
    const definitions = defs || schema.definitions;
    const schemaType = Array.isArray(schema.type) ? schema.type[0] : schema.type;
    if (schemaType === 'object') {
        const generated = {};
        Object.keys(schema.properties).forEach(key => {
            const value = schema.properties[key];
            const valueType = Array.isArray(value.type) ? value.type[0] : value.type;
            if (value.default) {
                generated[key] = value.default;
                return;
            }
            if (value.$ref) {
                const refKey = Object.keys(definitions).find(entry => definitions[entry].$id === value.$ref || `#/definitions/${definitions[entry]}` === value.$ref);
                const ref = definitions[refKey];
                generated[key] = objectFromSchema(ref, definitions);
                return;
            }
            if (valueType === 'object' && isObject(value.properties)) {
                generated[key] = objectFromSchema(value, definitions);
                return;
            }
            generated[key] = emptyJsValues[valueType];
        });
        return generated;
    } else {
        return schema.default || emptyJsValues[schemaType];
    }
}

function deepCompare(value1, value2) {
    if (isObject(value1) && isObject(value2)) {
        const keys = Object.keys(value1);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (!deepCompare(value1[key], value2[key])) {
                return false;
            }
        }
        return true;
    }
    if (Array.isArray(value1) && Array.isArray(value2)) {
        for (let i = 0; i < value1.length; i++) {
            if (!deepCompare(value1[i], value2[i])) {
                return false;
            }
        }
        return true;
    }
    return value1 === value2;
}

function mergeObjects(value1, value2) {
    if (!isObject(value1) && !isObject(value2)) {
        if (Array.isArray(value1) && Array.isArray(value2)) {
            const resultArr = [ ...value1 ];
            value2.forEach(entry => {
                if (resultArr.some(result => deepCompare(result, entry))) {
                    return;
                }
                resultArr.push(entry);
            });
            return resultArr;
        }
        return value1;
    }
    const merged = { ...value1 };
    Object.keys(value2).forEach(key => {
        if (value1[key]) {
            merged[key] = mergeObjects(value1[key], value2[key]);
            return;
        }
        merged[key] = value2[key];
    });
    return merged;
}

function deepCopyDirectory(dirPath, targetPath) {
    const entryList = fs.readdirSync(dirPath).filter(entry => !GEN_CONFIG.ignore.includes(entry));
    entryList.forEach(entry => {
        const entryPath = path.join(dirPath, entry);
        if (fs.statSync(entryPath).isDirectory()) {
            const targetDir = path.join(targetPath, entry);
            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir);
            }
            deepCopyDirectory(entryPath, targetDir);
            return;
        }
        const file = fs.readFileSync(entryPath);
        fs.writeFileSync(path.join(targetPath, entry), file);
    });
}

function execProcess(command, options = {}) {
    return new Promise((resolve, reject) => {
        exec(command, options, (error, stdout, stderr) => {
            if (error) {
                reject(`exec error for command ${command}: ${error}`);
            }
            if (stderr) {
                logger.error(`stderr for command ${command}: ${stderr}`);
            }
            logger.print(stdout);
            resolve();
        });
    });
}

exports.isObject = isObject;
exports.objectFromSchema = objectFromSchema;
exports.deepCompare = deepCompare;
exports.mergeObjects = mergeObjects;
exports.deepCopyDirectory = deepCopyDirectory;
exports.execProcess = execProcess;