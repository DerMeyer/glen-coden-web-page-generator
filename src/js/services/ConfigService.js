class ConfigService {
    constructor() {
        this.config = {};
        this.componentsList = {};
    }

    init(config) {
        this.config = config;
        this._createComponentsList(this.config.components);
    }

    _createComponentsList(components) {
        if (!Array.isArray(components)) {
            console.warn('Config has no components list at ConfigService.init');
            return;
        }
        components.forEach(entry => {
            delete entry.initialState;
            this.componentsList[entry.id] = {
                ...this.config.global,
                ...entry
            };
            if (entry.children.length) {
                this._createComponentsList(entry.children);
            }
        });
    }

    getInitialState() {
        const { initialState, components } = this.config;
        if (!initialState || !components) {
            return {};
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
        return {
            ...initialState,
            ...state
        };
    }

    getConfig(id) {
        if (!id || !this.componentsList[id]) {
            if (!this.config.global) {
                return {};
            }
            return this.config.global;
        }
        return this.componentsList[id];
    }
}

export default ConfigService;