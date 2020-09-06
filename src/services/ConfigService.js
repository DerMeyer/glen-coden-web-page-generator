import { BreakPointTypes } from '../js/helpers';
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
    const indices = valueLengthToFontSizeIndex[value.length];
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
    const indices = valueLengthToColorIndex[value.length];
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
        || (isTypeArray[key] && !Array.isArray(value[0]))
    ) {
        return value;
    }
    if (value.length < 2) {
        return value[0];
    }
    const indices = valueLengthToBreakpointIndex[value.length];
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
                this.global[type][key] = mapToBreakpointType(key, value, type);
            });
        });
    }

    _createComponents(components) {
        Object.values(BreakPointTypes).forEach(type => {
            if (!this.components[type]) {
                this.components[type] = {};
            }
            components.forEach(comp => {
                delete comp.initialState;
                const global = {};
                const { fromGlobal } = comp;
                if (fromGlobal) {
                    [].concat(fromGlobal).forEach(prop => {
                        global[prop] = this.global[type][prop];
                    });
                }
                this.components[type][comp.id] = {
                    ...global,
                    ...comp
                };
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

    getInitialState = () => {
        return this.initialState;
    }

    getProps = id => {
        const global = this.global[this.breakPointType];
        const components = this.components[this.breakPointType];
        if (!id || !components[id]) {
            if (!global) {
                return {};
            }
            return { global };
        }
        const props = components[id];
        props.id = id;
        return props;
    }

    setBreakpointType(type) {
        this.breakPointType = type;
    }
}

export default ConfigService;