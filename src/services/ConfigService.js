import { requestService } from '../index';
import PROJ_INFO from '../project-info.json';
import DEV_CONFIG from '../dev-project-config.json';

class ConfigService {
    constructor() {
        this.config = {};
        this.componentsList = {};
    }

    init() {
        return Promise.resolve()
            .then(() => requestService.get(`http://116.202.99.153/api/config/${PROJ_INFO.projectName}.json`))
            .then(PROD_CONFIG => {
                this.config = process.env.NODE_ENV && process.env.NODE_ENV === 'production' ? PROD_CONFIG : DEV_CONFIG;
                this._createComponentsList(this.config.components);
            });
    }

    _createComponentsList(components) {
        if (!Array.isArray(components)) {
            console.warn('Missing components list at ConfigService');
            return;
        }
        components.forEach(entry => {
            delete entry.initialState;
            this.componentsList[entry.id] = {
                global: this.config.global,
                ...entry
            };
            if (entry.children.length) {
                this._createComponentsList(entry.children);
            }
        });
    }

    getInitialState = () => {
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

    getProps = id => {
        if (!id || !this.componentsList[id]) {
            if (!this.config.global) {
                return {};
            }
            return {
                global: this.config.global
            };
        }
        const props = this.componentsList[id];
        props.id = id;
        return props;
    }
}

export default ConfigService;