import { BreakPointTypes, isObject } from '../../js/helpers';

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

export function mapToBreakpointType(key, value, type) {
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

export function applyTheme(config, theme) {
    if (!isObject(config) || !isObject(theme)) {
        return;
    }
    Object.keys(config).forEach(k => {
        const v = config[k];
        if (isObject(v)) {
            applyTheme(v, theme);
            return;
        }
        if (k === 'fontSize' && typeof v === 'number') {
            config[k] = `${theme.fontSizes[v]}px`;
            return;
        }
        if (
            ((typeof k === 'string' && k.toLowerCase().includes('color')) || k === 'bg')
            && theme.colors[v]
        ) {
            config[k] = theme.colors[v];
            return;
        }
        if (
            (
                k === 'p' || k === 'px' || k === 'py' || k === 'pt' || k === 'pr' || k === 'pb' || k === 'pl'
                || k === 'm' || k === 'mx' || k === 'my' || k === 'mt' || k === 'mr' || k === 'mb' || k === 'ml'
                || k === 'gap' || k === 'columnGap' || k === 'rowGap'
            )
            && typeof v === 'number'
        ) {
            config[k] = theme.space[v] === 0 ? 0 : `${theme.space[v]}px`;
            return;
        }
        if (
            (k === 'font')
            && theme.fonts[v]
        ) {
            config[k] = theme.fonts[v];
            return;
        }
        if (
            (k === 'fontWeight')
            && theme.fontWeights[v]
        ) {
            config[k] = theme.fontWeights[v];
            return;
        }
        if (
            (k === 'lineHeight')
            && theme.lineHeights[v]
        ) {
            config[k] = theme.lineHeights[v];
            return;
        }
        if (
            (k === 'shadow')
            && theme.shadows[v]
        ) {
            config[k] = theme.shadows[v];
            return;
        }
        if (k === 'variant') {
            let variants = theme.variants;
            if (
                config.component
                && (config.component === 'Text' || config.component === 'Heading')
            ) {
                variants = theme.text;
            }
            if (config.component && config.component === 'Button') {
                variants = theme.buttons;
            }
            Object.keys(variants).forEach(variant => {
                if (v === variant) {
                    Object.keys(variants[variant]).forEach(prop => {
                        config[prop] = variants[variant][prop];
                    });
                }
            });
        }
    });
}

export function getPropsFromGlobal(element, global) {
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
            element[k] = getPropsFromGlobal(element[k], global);
        }
    });
    return element;
}
