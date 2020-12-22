import { BreakPointTypes } from '../../../lib/util';

const isTypeArray = [
    'fontTypes',
    'fontSizes',
    'space',
    'fromGlobal'
];

const excludeFromMapping = [
    'breakpoints',
    'children'
];

const valueLengthToBreakpointIndex = [
    [ 0, 0, 1, 1, 1 ],
    [ 0, 1, 2, 2, 2 ],
    [ 0, 1, 2, 3, 3 ],
    [ 0, 1, 2, 3, 4 ]
];

function getValueForBreakpoint(key, value, type) {
    if (
        !Array.isArray(value)
        || (isTypeArray.includes(key) && !Array.isArray(value[0]))
        || excludeFromMapping.includes(key)
    ) {
        return value;
    }
    if (value.length < 2) {
        return value[0];
    }
    const indices = valueLengthToBreakpointIndex[value.length - 2];
    const valIndex = indices[Object.values(BreakPointTypes).indexOf(type)];
    return value[valIndex];
}

export default getValueForBreakpoint;