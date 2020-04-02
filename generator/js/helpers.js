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
        console.warn('objectFromSchema only generates JavaScript form JavaScript.');
        return;
    }
    const definitions = defs || schema.definitions;
    if (schema.type === 'object') {
        const generated = {};
        Object.keys(schema.properties).forEach(key => {
            const value = schema.properties[key];
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
            if (value.type === 'object' && isObject(value.properties)) {
                generated[key] = objectFromSchema(value, definitions);
                return;
            }
            generated[key] = emptyJsValues[value.type];
        });
        return generated;
    } else {
        return schema.default || emptyJsValues[schema.type];
    }
}

function mergeObjects(value1, value2) {
    if (!isObject(value1) && !isObject(value2)) {
        if (Array.isArray(value1) && Array.isArray(value2)) {
            return [
                ...value1,
                ...value2
            ];
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

exports.isObject = isObject;
exports.objectFromSchema = objectFromSchema;
exports.mergeObjects = mergeObjects;