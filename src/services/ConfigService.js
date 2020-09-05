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
    return indices[BreakPointTypes.values().indexOf(type)];
}


class ConfigService {
    constructor() {
        this.global = {};
        this.components = {};
        this.initialState = {};
    }

    init() {
        return Promise.resolve()
            .then(() => requestService.get(`http://116.202.99.153/api/config/${PROJ_INFO.projectName}`))
            .then(PROD_CONFIG => {
                const config = process.env.NODE_ENV && process.env.NODE_ENV === 'production' ? PROD_CONFIG : DEV_CONFIG;

                this._createGlobal(config.global);
                this._createComponents(config.components);
                this._createInitialState(config.initialState, config.components);
            });
    }

    _createGlobal(config) {
        BreakPointTypes.values().forEach(type => {
            const entryForType = {};
            Object.keys(config).forEach(key => {
                entryForType[key] = mapToBreakpointType(key, config[key], type);
            });
            this.global[type] = entryForType;
        });
    }

    _createComponents(components) {
        if (!Array.isArray(components)) {
            console.warn('Missing components list at ConfigService');
            return;
        }
        components.forEach(entry => {
            delete entry.initialState;
            this.components[entry.id] = {
                global: this.global,
                ...entry
            };
            if (entry.children.length) {
                this._createComponents(entry.children);
            }
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
        if (!id || !this.components[id]) {
            if (!this.global) {
                return {};
            }
            return {
                global: this.global
            };
        }
        const props = this.components[id];
        props.id = id;
        return props;
    }
}

export default ConfigService;