class ConfigService {
    constructor(projectMap) {
        this.name = projectMap.name;
        this.style = projectMap.style;
        this.global = projectMap.global;
        this.components = projectMap.components;
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
            name: this.name,
            style: this.style,
            ...this.global
        };
    }

    getComponentConfig(chain, componentName) {
        return [...chain, componentName].reduce((result, child) => result[child], this.componentsConfig);
    }
}

export default ConfigService;