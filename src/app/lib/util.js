// enums

export const BreakPointTypes = {
    MOBILE_PORTRAIT: 'mobile-portrait',
    MOBILE_LANDSCAPE: 'mobile-landscape',
    TABLET: 'tablet',
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
    [BreakPointTypes.MOBILE_PORTRAIT]: 576,
    [BreakPointTypes.MOBILE_LANDSCAPE]: 768,
    [BreakPointTypes.TABLET]: 992,
    [BreakPointTypes.DESKTOP]: 1200,
    [BreakPointTypes.DESKTOP_MAX]: Infinity
};

// functions

export function isObject(val) {
    return val !== null && typeof val !== 'function' && typeof val === 'object' && !Array.isArray(val);
}

export function isEmail(str) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(str).toLowerCase());
}

export function deepCompare(val1, val2) {
    if (isObject(val1) && isObject(val2)) {
        const keys = Object.keys(val1);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (!deepCompare(val1[key], val2[key])) {
                return false;
            }
        }
        return true;
    }
    if (Array.isArray(val1) && Array.isArray(val2)) {
        for (let i = 0; i < val1.length; i++) {
            if (!deepCompare(val1[i], val2[i])) {
                return false;
            }
        }
        return true;
    }
    return val1 === val2;
}

export function mergeObjects(val1, val2) {
    if (!isObject(val1) && !isObject(val2)) {
        if (Array.isArray(val1) && Array.isArray(val2)) {
            const resultArr = [ ...val1 ];
            val2.forEach(entry => {
                if (resultArr.some(result => deepCompare(result, entry))) {
                    return;
                }
                resultArr.push(entry);
            });
            return resultArr;
        }
        return val1;
    }
    const merged = { ...val1 };
    Object.keys(val2).forEach(key => {
        if (val1[key]) {
            merged[key] = mergeObjects(val1[key], val2[key]);
            return;
        }
        merged[key] = val2[key];
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

export function setBgStyle(val, style) {
    if (typeof val === 'string') {
        if ([ '.png', '.jpg', '.jpeg', '.JPG' ].some(type => val.endsWith(type))) {
            style.backgroundImage = `url("${val}")`;
            style.backgroundRepeat = 'no-repeat';
            style.backgroundPosition = 'center';
            style.backgroundSize = 'cover';
        } else {
            style.backgroundColor = val;
        }
    }
}