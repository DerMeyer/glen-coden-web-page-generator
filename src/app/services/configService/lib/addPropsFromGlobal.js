import { isObject } from '../../../util';

function addPropsFromGlobal(element, global) {
    Object.keys(element).forEach(k => {
        if (k === 'fromGlobal') {
            [].concat(element[k]).forEach(e => {
                if (isObject(e)) {
                    const { key, value, property } = e;
                    if (typeof property === 'undefined') {
                        element[key] = global[value];
                        return;
                    }
                    element[key] = global[value][property];
                    return;
                }
                element[e] = global[e];
                delete element[k];
            });
        }
        if (isObject(element[k])) {
            element[k] = addPropsFromGlobal(element[k], global);
        }
    });
    return element;
}

export default addPropsFromGlobal;