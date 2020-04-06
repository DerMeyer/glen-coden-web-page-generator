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

export function isObject(value) {
    return value !== null && typeof value !== 'function' && typeof value === 'object' && !Array.isArray(value);
}

export function mergeObjects(value1, value2) {
    if (!isObject(value1) && !isObject(value2)) {
        if (Array.isArray(value1) && Array.isArray(value2)) {
            return [
                ...value1,
                ...value2
            ];
        }
        return value1;
    }
    const merged = { ...value1 };
    Object.keys(value2).forEach(key => {
        if (value1[key]) {
            merged[key] = mergeObjects(value1[key], value2[key]);
            return;
        }
        merged[key] = value2[key];
    });
    return merged;
}

export function getBreakPointType(viewportWidth = window.innerWidth) {
    return Object.keys(BreakPoints).find(type => BreakPoints[type] > viewportWidth);
}

export function getDeviceType() {
    return typeof window.orientation !== "undefined" || navigator.userAgent.includes('IEMobile')
        ? DeviceTypes.MOBILE
        : DeviceTypes.DESKTOP;
}

export function getOrientationType() {
    let isPortrait = window.innerWidth < window.innerHeight;
    if (isObject(window.screen.orientation)) {
        const { type } = window.screen.orientation;
        isPortrait = typeof type === 'string' && type.includes('portrait');
    }
    return isPortrait ? OrientationTypes.PORTRAIT : OrientationTypes.LANDSCAPE;
}

export function getContentSize(deviceType, pageContentSize) {
    const width = deviceType === DeviceTypes.MOBILE
        ? pageContentSize.widthMobile
        : pageContentSize.width;
    const height = deviceType === DeviceTypes.MOBILE
        ? pageContentSize.heightMobile
        : pageContentSize.height;
    return { width, height };
}

export function i18n(translations, language = navigator.language.slice(0, 2)) {
    if (!isObject(translations)) {
        return translations;
    }
    const trans = translations[language];
    if (!trans) {
        const fallbackTrans = translations.en;
        if (!fallbackTrans) {
            return 'No text';
        }
        return fallbackTrans;
    }
    return trans;
}

export function getSizeFactor(state, config) {
    const { sizing } = config;
    if (!sizing || !isObject(sizing)) {
        return 1;
    }
    if (state.deviceType === DeviceTypes.MOBILE) {
        if (state.orientationType === OrientationTypes.PORTRAIT) {
            return sizing.portrait || 1;
        }
        return sizing.landscape || 1;
    }
    if (state.breakPointType === BreakPointTypes.DESKTOP_MAX) {
        return sizing.max || 1;
    }
    return sizing.desktop || 1;
}