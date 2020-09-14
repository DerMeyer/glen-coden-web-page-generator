import { BreakPointTypes, isObject } from '../js/helpers';
import { requestService, trackingService } from '../index';
import PROJ_INFO from '../project-info.json';
import DEV_CONFIG from '../dev-project-config.json';


const configHard = {
    "title": "Hainarbeit",
    "description": "Shared working space by Volkspark Friedrichshain park in Berlin.",
    "global": {
        "fontTypes": [
            {
                "name": "'Roboto', 'Arial', 'sans-serif'"
            }
        ],
        "contentSize": [
            {
                "width": 0.9,
                "height": 0.9
            },
            {
                "width": 1,
                "height": 1
            }
        ],
        "pageWidth": 1,
        "maxContentWidth": 1100,
        "bg": "white",
        "timeTilFadeIn": 0.2,
        "fadeInTime": 0.5,
        "loadingTimeout": 10,
        "usePortraitImages": true,
        "maxPageWidth": 0
    },
    "theme": {
        "breakpoints": [
            "576px",
            "768px",
            "992px",
            "1200px"
        ],
        "fontSizes": [
            16,
            24,
            32,
            48,
            80
        ],
        "colors": {
            "black": "#000",
            "lightgrey": "#EDEDED",
            "darkgrey": "#2F2E2E",
            "heading": "#2F2E2E",
            "white": "#fff"
        },
        "space": [
            0,
            4,
            8,
            16,
            32,
            64,
            128,
            256
        ],
        "fonts": {
            "body": "system-ui, sans-serif",
            "heading": "inherit",
            "monospace": "'Menlo', 'monospace'"
        },
        "fontWeights": {
            "body": 400,
            "heading": 700,
            "bold": 700
        },
        "lineHeights": {
            "body": 1.5,
            "heading": 1.25,
            "small": 1
        },
        "shadows": {
            "small": "0 0 4px rgba(0, 0, 0, .125)",
            "large": "0 0 24px rgba(0, 0, 0, .125)"
        },
        "variants": {
            "tileParagraph": {
                "color": "darkgrey",
                "fontSize": 0,
                "css": {
                    "marginTop": 0
                }
            },
            "tileHeading": {
                "color": "heading",
                "fontSize": 4,
                "lineHeight": "small",
                "css": {
                    "marginTop": 0
                }
            }
        },
        "text": {},
        "buttons": {
            "primary": {
                "color": "darkgrey"
            }
        }
    },
    "components": [
        {
            "component": "Page",
            "id": "nMyMSYVpl",
            "rows": 0,
            "minHeight": 0,
            "fromGlobal": [
                "contentSize",
                "maxContentWidth",
                "pageWidth",
                "maxPageWidth"
            ],
            "children": [
                {
                    "component": "Image",
                    "id": "qm1x4x19id",
                    "source": "images/bg-with-logo.jpg",
                    "subscribeToGlobalLoading": true,
                    "css": {
                        "width": "100%"
                    }
                },
                {
                    "component": "Flex",
                    "id": "HBNJTEgxR",
                    "flexDirection": "column",
                    "children": [
                        {
                            "component": "Box",
                            "id": "uP3yrDrpt",
                            "p": 5,
                            "pb": 4,
                            "width": 1,
                            "children": [
                                {
                                    "component": "Heading",
                                    "id": "BarhuT27zC",
                                    "text": {
                                        "en": "FEATURED PROJECTS"
                                    },
                                    "color": "heading",
                                    "as": "h2"
                                }
                            ]
                        },
                        {
                            "component": "Flex",
                            "id": "b-Yad2HG1",
                            "justifyContent": "space-between",
                            "px": 5,
                            "py": 4,
                            "children": [
                                {
                                    "component": "Box",
                                    "id": "Mdp_67-hR",
                                    "width": 0.3,
                                    "children": [
                                        {
                                            "component": "Heading",
                                            "id": "pwjwhljT62",
                                            "text": {
                                                "en": "SAN*JUAN*VILLA"
                                            },
                                            "as": "h1",
                                            "variant": "tileHeading"
                                        }
                                    ]
                                },
                                {
                                    "component": "Box",
                                    "id": "ScvxHbHhYE",
                                    "width": 0.3,
                                    "children": [
                                        {
                                            "component": "Text",
                                            "id": "KYXMs6oQ2L",
                                            "text": {
                                                "en": "I'm a paragraph. Click here to add your own text and edit me. It’s easy. Just click “Edit Text” or double click me to add your own content and make changes to the font. I’m a great place for you to tell a story and let your users know a little more about you."
                                            },
                                            "variant": "tileParagraph"
                                        }
                                    ]
                                },
                                {
                                    "component": "Box",
                                    "id": "aTvetNmKyJ",
                                    "width": 0.3,
                                    "children": [
                                        {
                                            "component": "Image",
                                            "id": "J_VhMt6isl",
                                            "source": "images/window-table.jpg",
                                            "width": 291,
                                            "height": 291
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "component": "Flex",
                            "id": "VRHCPDc3-",
                            "justifyContent": "space-between",
                            "px": 5,
                            "py": 4,
                            "children": [
                                {
                                    "component": "Box",
                                    "id": "R4PQiCgOpo",
                                    "width": 0.3,
                                    "children": [
                                        {
                                            "component": "Text",
                                            "id": "6bH_UHy0PS",
                                            "text": {
                                                "en": "I'm a paragraph. Click here to add your own text and edit me. It’s easy. Just click “Edit Text” or double click me to add your own content and make changes to the font. Feel free to drag and drop me anywhere you like on your page."
                                            },
                                            "variant": "tileParagraph"
                                        },
                                        {
                                            "component": "Text",
                                            "id": "351Aqvxmg7",
                                            "text": {
                                                "en": "This is a great space to write long text about your company and your services. You can use this space to go into a little more detail about your company. "
                                            },
                                            "variant": "tileParagraph"
                                        }
                                    ]
                                },
                                {
                                    "component": "Box",
                                    "id": "GGeCY2XPi",
                                    "width": 0.3,
                                    "children": [
                                        {
                                            "component": "Image",
                                            "id": "PnoZvze0cV",
                                            "source": "images/room-at-angle.jpg",
                                            "width": 291,
                                            "height": 291
                                        }
                                    ]
                                },
                                {
                                    "component": "Box",
                                    "id": "6HYINF0Qv4",
                                    "width": 0.3,
                                    "children": [
                                        {
                                            "component": "Heading",
                                            "id": "34uA0pS2xu",
                                            "text": {
                                                "en": "SPORN*HOUSE,*PARIS"
                                            },
                                            "as": "h1",
                                            "variant": "tileHeading"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "component": "LoadingOverlay",
            "id": "fkLCSJAq9",
            "color": "black",
            "bg": "white",
            "fromGlobal": [
                "fadeInTime"
            ]
        }
    ],
    "_lastUpdated": "2020-09-14T12:05:24.085Z",
    "initialState": {}
}


const isTypeArray = [
    'fontTypes',
    'fromGlobal'
];

const excludeFromMapping = [
    'theme',
    'children'
];

const valueLengthToBreakpointIndex = [
    [ 0, 0, 1, 1, 1 ],
    [ 0, 1, 2, 2, 2 ],
    [ 0, 1, 2, 3, 3 ],
    [ 0, 1, 2, 3, 4 ]
];

function mapToBreakpointType(key, value, type) {
    if (
        !Array.isArray(value)
        || (isTypeArray.includes(key) && !Array.isArray(value[0]))
        || excludeFromMapping.includes(key)
    ) {
        return value;
    }
    if (value.length < 2) {
        return value[0];
    }
    const indices = valueLengthToBreakpointIndex[value.length - 2];
    const valIndex = indices[Object.values(BreakPointTypes).indexOf(type)];
    return value[valIndex];
}

function applyTheme(config, theme) {
    if (!isObject(config) || !isObject(theme)) {
        return;
    }
    Object.keys(config).forEach(k => {
        const v = config[k];
        if (isObject(v)) {
            applyTheme(v, theme);
            return;
        }
        if (k === 'fontSize' && typeof v === 'number') {
            config[k] = `${theme.fontSizes[v]}px`;
            return;
        }
        if (
            (k === 'color' || k === 'bg')
            && theme.colors[v]
        ) {
            config[k] = theme.colors[v];
            return;
        }
        if (
            (k === 'p' || k === 'px' || k === 'py' || k === 'pt' || k === 'pr' || k === 'pb' || k === 'pl' || k === 'm' || k === 'mx' || k === 'my' || k === 'mt' || k === 'mr' || k === 'mb' || k === 'ml')
            && typeof v === 'number'
        ) {
            config[k] = theme.space[v] === 0 ? 0 : `${theme.space[v]}px`;
            return;
        }
        if (
            (k === 'font')
            && theme.fonts[v]
        ) {
            config[k] = theme.fonts[v];
            return;
        }
        if (
            (k === 'fontWeight')
            && theme.fontWeights[v]
        ) {
            config[k] = theme.fontWeights[v];
            return;
        }
        if (
            (k === 'lineHeight')
            && theme.lineHeights[v]
        ) {
            config[k] = theme.lineHeights[v];
            return;
        }
        if (
            (k === 'shadow')
            && theme.shadows[v]
        ) {
            config[k] = theme.shadows[v];
            return;
        }

        // TODO add specific variants like eg buttons
        if (k === 'variant') {
            const { variants } = theme;
            Object.keys(variants).forEach(variant => {
                if (v === variant) {
                    Object.keys(variants[variant]).forEach(prop => {
                        config[prop] = variants[variant][prop];
                    });
                }
            });
        }
    });
}

function getPropsFromGlobal(element, global) {
    Object.keys(element).forEach(k => {
        if (k === 'fromGlobal') {
            [].concat(element[k]).forEach(e => {
                if (isObject(e)) {
                    const { key, value, property } = e;
                    if (typeof property === 'undefined') {
                        element[key] = global[value];
                        return;
                    }
                    element[key] = global[value][property];
                    return;
                }
                element[e] = global[e];
                delete element[k];
            });
        }
        if (isObject(element[k])) {
            element[k] = getPropsFromGlobal(element[k], global);
        }
    });
    return element;
}


class ConfigService {
    constructor() {
        this.theme = {};
        this.global = {};
        this.components = {};
        this.initialState = {};
        this.breakPointType = BreakPointTypes.MOBILE_PORTRAIT;
    }

    init() {
        return Promise.resolve()
            .then(() => requestService.get(`http://116.202.99.153/api/config/${PROJ_INFO.projectName}`))
            .then(PROD_CONFIG => {
                const config = process.env.NODE_ENV && process.env.NODE_ENV === 'production' ? PROD_CONFIG : DEV_CONFIG;
                //const config = configHard;

                trackingService.startProcessTimer('BUILD_CONFIG');

                this._createTheme(config.theme);
                this._createGlobal(config.global);
                this._createComponents(config.components);
                this._createInitialState(config.initialState, config.components);

                trackingService.stopProcessTimer('BUILD_CONFIG');

                console.log('CONFIG (global): ', this.global);// TODO remove dev code
                console.log('CONFIG (theme): ', this.theme);// TODO remove dev code
                console.log('CONFIG (components): ', this.components);// TODO remove dev code
            });
    }

    getProps = id => {
        const components = this.components[this.breakPointType];
        if (!id || !components[id]) {
            return {
                global: this.global[this.breakPointType],
                theme: this.theme
            };
        }
        return components[id];
    }

    getInitialState = () => {
        return this.initialState;
    }

    setBreakpointType(type) {
        this.breakPointType = type;
    }

    _createTheme(theme) {
        if (theme.variants) {
            Object.keys(theme.variants).forEach(key => {
                applyTheme(theme.variants[key], theme);
            });
        }
        this.theme = theme;
    }

    _createGlobal(config) {
        Object.values(BreakPointTypes).forEach(type => {
            if (!this.global[type]) {
                this.global[type] = {};
            }
            Object.keys(config).forEach(key => {
                this.global[type][key] = mapToBreakpointType(key, config[key], type);
            });
            applyTheme(this.global[type], this.theme);
        });
    }

    _createComponents(components) {
        Object.values(BreakPointTypes).forEach(type => {
            if (!this.components[type]) {
                this.components[type] = {};
            }
            components.forEach(c => {
                const mappedComp = {};
                Object.keys(c).forEach(key => {
                    const value = c[key];
                    mappedComp[key] = mapToBreakpointType(key, value, type);
                });
                const comp = getPropsFromGlobal(mappedComp, this.global[type]);
                delete comp.initialState;
                applyTheme(comp, this.theme);
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