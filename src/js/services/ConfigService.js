class ConfigService {
    constructor(config) {
        this.style = config.style;
        this.global = config.global;
        this.components = config.components;
        this.componentsConfig = {};
        this.init();
    }

    init() {
        this.components.forEach(entry => {
            delete entry.initialState;
            this.componentsConfig[entry.id] = {
                ...entry,
                style: {
                    ...this.style,
                    ...entry.style
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

    getComponentConfig(id) {
        return this.componentsConfig[id];
    }
}

export default ConfigService;