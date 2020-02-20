exports.isObject = function(value) {
    return value !== null && typeof value !== 'function' && typeof value === 'object' && !Array.isArray(value);
};
