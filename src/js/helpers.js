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

export function getInitialState(config) {
    const componentsInitialState = {};
    Object.keys(config.components).forEach(key => {
        componentsInitialState[key] = {
            ...config.components[key].initialState
        };
    });
    return {
        ...config.initialState,
        ...componentsInitialState
    };
}

export function getComponentState(chain, componentName, state) {
    return [...chain, componentName].reduce((result, child) => result[child], state);
}