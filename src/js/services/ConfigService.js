class ConfigService {
    constructor(config) {
        this.style = config.style;
        this.global = config.global;
        this.componentsMap = config.components;
        this.componentsConfig = {};
        this.init();
    }

    init() {
        this.addComponentsConfig(this.componentsMap);
    }

    addComponentsConfig(list) {
        list.forEach(entry => {
            delete entry.initialState;
            this.componentsConfig[entry.id] = {
                ...entry,
                style: {
                    ...this.style,
                    ...entry.style
                }
            };
            if (entry.children.length) {
                this.addComponentsConfig(entry.children);
            }
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