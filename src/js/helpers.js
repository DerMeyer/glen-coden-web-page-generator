// enums

export const BreakPointTypes = {
    MOBILE_PORTRAIT: 'mobile-portrait',
    MOBILE_LANDSCAPE: 'mobile-landscape',
    TABLET: 'tablet',
    DESKTOP_MIN: 'desktop-small',
    DESKTOP: 'desktop',
    DESKTOP_MAX: 'desktop-max'
};

export const DeviceTypes = {
    MOBILE: 'mobile',
    DESKTOP: 'desktop'
};

export const OrientationTypes = {
    PORTRAIT: 'portrait',
    LANDSCAPE: 'landscape'
};

export const TargetImageRatios = {
    DEFAULT: 'default',
    PORTRAIT: 'portrait'
};

// lists

export const targetImageSizes = [
    { ratio: TargetImageRatios.DEFAULT, width: 100 },
    { ratio: TargetImageRatios.DEFAULT, width: 300 },
    { ratio: TargetImageRatios.DEFAULT, width: 500 },
    { ratio: TargetImageRatios.DEFAULT, width: 750 },
    { ratio: TargetImageRatios.DEFAULT, width: 1000 },
    { ratio: TargetImageRatios.DEFAULT, width: 1500 },
    { ratio: TargetImageRatios.DEFAULT, width: 2500 },
    { ratio: TargetImageRatios.PORTRAIT, width: 450, height: 800 }
];

// maps

export const BreakPoints = {
    [BreakPointTypes.MOBILE_PORTRAIT]: 450,
    [BreakPointTypes.MOBILE_LANDSCAPE]: 850,
    [BreakPointTypes.TABLET]: 1050,
    [BreakPointTypes.DESKTOP_MIN]: 1250,
    [BreakPointTypes.DESKTOP]: 2000,
    [BreakPointTypes.DESKTOP_MAX]: Infinity
};

// functions

export function getBreakPointType(viewportWidth = window.innerWidth) {
    return Object.keys(BreakPoints).find(type => BreakPoints[type] > viewportWidth);
}

export function getDeviceType() {
    return typeof window.orientation !== "undefined" || navigator.userAgent.includes('IEMobile')
        ? DeviceTypes.MOBILE
        : DeviceTypes.DESKTOP;
}

export function getOrientationType() {
    const orientation = window.screen.orientation;
    return typeof orientation === 'string' && orientation.includes('portrait')
        ? OrientationTypes.PORTRAIT
        : OrientationTypes.LANDSCAPE;
}

export function getInitialState(projectMap) {
    const componentsInitialState = {};
    Object.keys(projectMap.components).forEach(key => {
        componentsInitialState[key] = {
            ...projectMap.components[key].initialState
        };
    });
    return {
        ...projectMap.initialState,
        ...componentsInitialState
    };
}

export function getComponentState(chain, componentName, state) {
    return [...chain, componentName].reduce((result, child) => result[child], state);
}