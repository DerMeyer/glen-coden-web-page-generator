class ConfigService {
    constructor(config) {
        this.style = config.style;
        this.global = config.global;
        this.components = config.components;
        this.componentsConfig = {};
        this.init();
    }

    init() {
        Object.keys(this.components).forEach(key => {
            delete this.components[key].initialState;
            this.componentsConfig[key] = {
                ...this.components[key],
                style: {
                    ...this.style,
                    ...this.components[key].style
                }
            };
        });
    }

    getProjectConfig() {
        return {
            style: this.style,
            ...this.global
        };
    }

    getComponentConfig(chain, componentName) {
        return [...chain, componentName].reduce((result, child) => result[child], this.componentsConfig);
    }
}

export default ConfigService;