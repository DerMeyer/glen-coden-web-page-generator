import { requestService, trackingService } from '../../index';
import { mapToBreakpointType, applyTheme, getPropsFromGlobal } from './util';
import PROJ_INFO from '../../project-info.json';
import DEV_CONFIG from '../../_config.json';


class ConfigService {
    constructor() {
        this.config = {};
        this.theme = {};
        this.global = {};
        this.components = {};
        this.initialState = {};
        this.breakPointType = '';
    }

    init() {
        return Promise.resolve()
            .then(() => requestService.get(`${requestService.apiRoute}/config/${PROJ_INFO.projectName}`))
            .then(PROD_CONFIG => {
                this.config = process.env.NODE_ENV && process.env.NODE_ENV === 'production' ? PROD_CONFIG : DEV_CONFIG;
                this._createInitialState(this.config.initialState, this.config.components);
            });
    }

    getProps = id => {
        if (!id || !this.components[id]) {
            return {
                global: this.global,
                theme: this.theme
            };
        }
        return this.components[id];
    }

    getInitialState = () => {
        return this.initialState;
    }

    setBreakpointType(type) {
        if (type === this.breakPointType) {
            return;
        }
        this.breakPointType = type;

        trackingService.startProcessTimer('CREATE_THEME_GLOBAL_AND_COMPS');

        this._createTheme(this.config.theme);
        this._createGlobal(this.config.global);
        this._createComponents(this.config.components);

        console.log('CONFIG (theme): ', this.theme);// TODO remove dev code
        console.log('CONFIG (global): ', this.global);// TODO remove dev code
        console.log('CONFIG (components): ', this.components);// TODO remove dev code

        trackingService.stopProcessTimer('CREATE_THEME_GLOBAL_AND_COMPS');
    }

    _createTheme(config) {
        const theme = {};
        Object.keys(config).forEach(key => {
            theme[key] = mapToBreakpointType(key, config[key], this.breakPointType);
        });
        if (theme.variants) {
            this._createVariants(theme.variants, theme);
        }
        if (theme.text) {
            this._createVariants(theme.text, theme);
        }
        if (theme.buttons) {
            this._createVariants(theme.buttons, theme);
        }
        this.theme = theme;
    }

    _createVariants(variants, theme) {
        Object.keys(variants).forEach(key => {
            const v = {};
            Object.keys(variants[key]).forEach(k => {
                v[k] = mapToBreakpointType(k, variants[key][k], this.breakPointType);
            });
            applyTheme(v, theme);
            variants[key] = v;
        });
    }

    _createGlobal(config) {
        Object.keys(config).forEach(key => {
            this.global[key] = mapToBreakpointType(key, config[key], this.breakPointType);
        });
        applyTheme(this.global, this.theme);
    }

    _createComponents(components) {
        components.forEach(c => {
            const mappedComp = {};
            Object.keys(c).forEach(key => {
                const value = c[key];
                mappedComp[key] = mapToBreakpointType(key, value, this.breakPointType);
            });
            const comp = getPropsFromGlobal(mappedComp, this.global);
            delete comp.initialState;
            applyTheme(comp, this.theme);
            this.components[comp.id] = { ...comp };
            if (Array.isArray(comp.children) && comp.children.length) {
                this._createComponents(comp.children);
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
}

export default ConfigService;