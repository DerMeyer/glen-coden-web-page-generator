import { BreakPointTypes, isObject } from '../js/helpers';
import { requestService, trackingService } from '../index';
import PROJ_INFO from '../project-info.json';
import DEV_CONFIG from '../dev-project-config.json';


const isTypeArray = [
    'fontTypes',
    'fromGlobal'
];

const excludeFromMapping = [
    'theme',
    'children'
];

const valueLengthToBreakpointIndex = [
    [ 0, 0, 1, 1, 1 ],
    [ 0, 1, 2, 2, 2 ],
    [ 0, 1, 2, 3, 3 ],
    [ 0, 1, 2, 3, 4 ]
];

function mapToBreakpointType(key, value, type) {
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

function applyTheme(config, theme) {
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
            (k === 'color' || k === 'bg')
            && !v.startsWith('#')
        ) {
            config[k] = theme.colors[v];
            return;
        }
        if (
            (k === 'p' || k === 'px' || k === 'py' || k === 'm' || k === 'mx' || k === 'my')
            && typeof v === 'number'
        ) {
            config[k] = `${theme.space[v]}px`;
            return;
        }

        if (k === 'variant') {
            const { variants } = theme;
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

function getPropsFromGlobal(element, global) {
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


class ConfigService {
    constructor() {
        this.theme = {};
        this.global = {};
        this.components = {};
        this.initialState = {};
        this.breakPointType = BreakPointTypes.MOBILE_PORTRAIT;
    }

    init() {
        return Promise.resolve()
            .then(() => requestService.get(`http://116.202.99.153/api/config/${PROJ_INFO.projectName}`))
            .then(PROD_CONFIG => {
                const config = process.env.NODE_ENV && process.env.NODE_ENV === 'production' ? PROD_CONFIG : DEV_CONFIG;

                trackingService.startProcessTimer('BUILD_CONFIG');

                this._createTheme(config.theme);
                this._createGlobal(config.global);
                this._createComponents(config.components);
                this._createInitialState(config.initialState, config.components);

                trackingService.stopProcessTimer('BUILD_CONFIG');

                console.log('GLOBAL: ', this.global);// TODO remove dev code
                console.log('THEME: ', this.theme);// TODO remove dev code
                console.log('COMPONENTS: ', this.components);// TODO remove dev code
            });
    }

    getProps = id => {
        const components = this.components[this.breakPointType];
        if (!id || !components[id]) {
            return this.global[this.breakPointType];
        }
        return components[id];
    }

    getInitialState = () => {
        return this.initialState;
    }

    setBreakpointType(type) {
        this.breakPointType = type;
    }

    _createTheme(theme) {
        if (theme.variants) {
            Object.keys(theme.variants).forEach(key => {
                applyTheme(theme.variants[key], theme);
            });
        }
        this.theme = theme;
    }

    _createGlobal(config) {
        Object.values(BreakPointTypes).forEach(type => {
            if (!this.global[type]) {
                this.global[type] = {};
            }
            Object.keys(config).forEach(key => {
                this.global[type][key] = mapToBreakpointType(key, config[key], type);
            });
            applyTheme(this.global[type], this.theme);
        });
    }

    _createComponents(components) {
        Object.values(BreakPointTypes).forEach(type => {
            if (!this.components[type]) {
                this.components[type] = {};
            }
            components.forEach(c => {
                const mappedComp = {};
                Object.keys(c).forEach(key => {
                    const value = c[key];
                    mappedComp[key] = mapToBreakpointType(key, value, type);
                });
                const comp = getPropsFromGlobal(mappedComp, this.global[type]);
                delete comp.initialState;
                applyTheme(comp, this.theme);
                this.components[type][comp.id] = { ...comp };
                if (Array.isArray(comp.children) && comp.children.length) {
                    this._createComponents(comp.children);
                }
            });
        });
    }

    _createInitialState(initialState, components) {
        if (!initialState || !components) {
            return;
        }
        const state = {};
        Object.keys(components).forEach(key => {
            if (!components[key].initialState) {
                return;
            }
            state[key] = {
                ...components[key].initialState
            };
        });
        this.initialState = {
            ...initialState,
            ...state
        };
    }
}

export default ConfigService;