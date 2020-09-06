import { BreakPointTypes, isObject } from '../js/helpers';
import { requestService } from '../index';
import PROJ_INFO from '../project-info.json';
import DEV_CONFIG from '../dev-project-config.json';

const valueLengthToFontSizeIndex = [
    [ 0, 1, 1, 1, 1 ],
    [ 0, 1, 1, 1, 2 ],
    [ 0, 1, 1, 2, 3 ],
    [ 0, 1, 2, 3, 4 ]
];

function mapToFontSizes(value) {
    if (!Array.isArray(value)) {
        return value;
    }
    if (value.length < 2) {
        return value[0];
    }
    const indices = valueLengthToFontSizeIndex[value.length - 2];
    return {
        body: value[indices[0]],
        h4: value[indices[1]],
        h3: value[indices[2]],
        h2: value[indices[3]],
        h1: value[indices[4]]
    };
}

const valueLengthToColorIndex = [
    [ 0, 0, 1, 1, 1 ],
    [ 0, 0, 1, 2, 2 ],
    [ 0, 0, 1, 2, 3 ],
    [ 0, 1, 2, 3, 4 ]
];

function mapToColors(value) {
    if (!Array.isArray(value)) {
        return value;
    }
    if (value.length < 2) {
        return value[0];
    }
    const indices = valueLengthToColorIndex[value.length - 2];
    return [
        value[indices[0]],
        value[indices[1]],
        value[indices[2]],
        value[indices[3]],
        value[indices[4]]
    ];
}

const isTypeArray = [
    'fontTypes',
    'fontSizes',
    'colors',
    'fromGlobal',
    'items'
];

const valueLengthToBreakpointIndex = [
    [ 0, 0, 1, 1, 1, 1 ],
    [ 0, 1, 2, 2, 2, 2 ],
    [ 0, 1, 2, 2, 2, 3 ],
    [ 0, 1, 2, 2, 3, 4 ],
    [ 0, 1, 2, 3, 4, 5 ]
];

function mapToBreakpointType(key, value, type) {
    if (
        !Array.isArray(value)
        || (isTypeArray.includes(key) && !Array.isArray(value[0]))
    ) {
        return value;
    }
    if (value.length < 2) {
        return value[0];
    }
    const indices = valueLengthToBreakpointIndex[value.length - 2];
    return indices[Object.values(BreakPointTypes).indexOf(type)];
}


class ConfigService {
    constructor() {
        this.global = {};
        this.components = {};
        this.initialState = {};
        this.breakPointType = BreakPointTypes.DESKTOP;
    }

    init() {
        return Promise.resolve()
            .then(() => requestService.get(`http://116.202.99.153/api/config/${PROJ_INFO.projectName}`))
            .then(PROD_CONFIG => {
                const config = process.env.NODE_ENV && process.env.NODE_ENV === 'production' ? PROD_CONFIG : DEV_CONFIG;

                this._createGlobal(config.global);
                this._createComponents(config.components);
                this._createInitialState(config.initialState, config.components);

                console.log('GLOBAL: ', this.global);// TODO remove dev code
                console.log('COMPONENTS: ', this.components);// TODO remove dev code
                console.log('INITIAL STATE: ', this.initialState);// TODO remove dev code
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
        if (!this) {
            return;
        }
        this.breakPointType = type;
    }

    _createGlobal(config) {
        Object.values(BreakPointTypes).forEach(type => {
            if (!this.global[type]) {
                this.global[type] = {};
            }
            Object.keys(config).forEach(key => {
                let value = config[key];
                if (key === 'fontSizes') {
                    value = mapToFontSizes(value);
                }
                if (key === 'colors') {
                    value = mapToColors(value);
                }
                if (
                    key === 'bgColor'
                    || key === 'overlayColor'
                    || key === 'themeColor'
                ) {
                    value = this.global[type].colors[value];
                }
                this.global[type][key] = mapToBreakpointType(key, value, type);
            });
        });
    }

    _createComponents(components) {
        Object.values(BreakPointTypes).forEach(type => {
            if (!this.components[type]) {
                this.components[type] = {};
            }
            components.forEach(c => {
                const comp = { ...c };
                delete comp.initialState;
                if (comp.fromGlobal) {
                    [].concat(comp.fromGlobal).forEach(e => {
                        if (isObject(e)) {
                            const { key, value, property } = e;
                            if (!property) {
                                comp[key] = this.global[type][value];
                                return;
                            }
                            comp[key] = this.global[type][value][property];
                            return;
                        }
                        comp[e] = this.global[type][e];
                    });
                }
                delete comp.fromGlobal;
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