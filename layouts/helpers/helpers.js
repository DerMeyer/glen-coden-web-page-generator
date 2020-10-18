// check if string is email
const isEmail = (str) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(str).toLowerCase());
};


// check for, compare, merge and stringify objects
function isObject(value) {
    return value !== null && typeof value !== 'function' && typeof value === 'object' && !Array.isArray(value)
}

function deepCompare(value1, value2) {
    if (isObject(value1) && isObject(value2)) {
        const keys = Object.keys(value1);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (!deepCompare(value1[key], value2[key])) {
                return false;
            }
        }
        return true;
    }
    if (Array.isArray(value1) && Array.isArray(value2)) {
        for (let i = 0; i < value1.length; i++) {
            if (!deepCompare(value1[i], value2[i])) {
                return false;
            }
        }
        return true;
    }
    return value1 === value2;
}

function mergeObjects(value1, value2) {
    if (!isObject(value1) && !isObject(value2)) {
        if (Array.isArray(value1) && Array.isArray(value2)) {
            const resultArr = [ ...value1 ];
            value2.forEach(entry => {
                if (resultArr.some(result => deepCompare(result, entry))) {
                    return;
                }
                resultArr.push(entry);
            });
            return resultArr;
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

function stringifyJS(value, depth = 0, last = false) {
    let result = '';
    if (isObject(value)) {
        const keys = Object.keys(value);
        if (!keys.length) {
            return '{}';
        }
        result += `{\n`;
        keys.forEach((key, index) => {
            result += `${'\t'.repeat(depth + 1)}${key}: `;
            result += stringifyJS(value[key], depth + 1, index === keys.length - 1);
            result += '\n';
        });
        result += `${'\t'.repeat(depth)}}${depth ? (last ? '' : ',') : ';'}`;
    } else if (Array.isArray(value)) {
        if (!value.length) {
            return '[]';
        }
        result += `[\n`;
        value.forEach((element, index) => {
            result += `${'\t'.repeat(depth + 1)}`;
            result += stringifyJS(element, depth + 1, index === value.length - 1);
            result += '\n';
        });
        result += `${'\t'.repeat(depth)}]${depth ? (last ? '' : ',') : ';'}`;
    } else if (typeof value === 'string') {
        return `'${value}'${depth ? (last ? '' : ',') : ';'}`;
    } else {
        return `${value}${depth ? (last ? '' : ',') : ';'}`;
    }
    return result;
}


// get a string of length from number
const numberToString = (number, length) => {
    const outputNumber = Math.abs(number);
    if (Number.isNaN(outputNumber) || typeof length !== 'number') {
        return '0';
    }
    const outputString = `${'0'.repeat(length)}${outputNumber}`;
    return outputString.slice(-length);
};


// get string camel cased
function toCamelCase(str) {
    return str
        .replace(/[^\w]/g, '_')
        .split('_')
        .map((word, index) => index === 0
            ? (word[0] ? word[0].toLowerCase() : '') + (word.slice(1) ? word.slice(1).toLowerCase() : '')
            : (word[0] ? word[0].toUpperCase() : '') + (word.slice(1) ? word.slice(1).toLowerCase() : '')
        )
        .join('');
}


// simple check for mobile device
function isMobileDevice() {
    return typeof window.orientation !== "undefined" || navigator.userAgent.includes('IEMobile');
}


// simple check for portrait orientation
function isPortraitOrientation() {
    const { type } = window.screen.orientation || {};
    if (type) {
        return typeof type === 'string' && type.includes('portrait');
    }
    return window.innerWidth < window.innerHeight;
}


// basically check for any non-desktop, non-chrome devices
function checkForMultipleDevices() {
    const isIPhoneDevice = navigator.userAgent.match(/iPhone/i) !== null;

    const isIPadDevice = navigator.userAgent.match(/iPad/i) !== null || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1 && !window.MSStream);

    const isIPodDevice = navigator.userAgent.match(/iPod/i) !== null;

    const isIOSDevice = navigator.userAgent.match(/iOS/i) !== null || isIPadDevice || isIPhoneDevice || isIPodDevice;

    const isAndroidDevice = navigator.userAgent.match(/Android/i) !== null;

    const isHPDevice = navigator.userAgent.match(/webOS/i) !== null;

    const isPlaybookDevice = navigator.userAgent.match(/PlayBook/i) !== null;

    const isBlackBerryDevice = navigator.userAgent.match(/BlackBerry/i) !== null || isPlaybookDevice;

    const isWindowsPhone = navigator.userAgent.match(/Windows Phone/i) !== null;

    const isKindle = (
        navigator.userAgent.match(/Kindle/i)
        || navigator.userAgent.match(/Silk/i)
        || navigator.userAgent.match(/KFOT/i)
        || navigator.userAgent.match(/KFTT/i)
        || navigator.userAgent.match(/KFJWI/i)
        || navigator.userAgent.match(/KFJWA/i)
        || navigator.userAgent.match(/KFSOWI/i)
        || navigator.userAgent.match(/KFTHWI/i)
        || navigator.userAgent.match(/KFTHWA/i)
        || navigator.userAgent.match(/KFAPWI/i)
        || navigator.userAgent.match(/KFAPWA/i)
    ) !== null ;

    const isMobileDevice = isBlackBerryDevice || isHPDevice || isAndroidDevice || isIOSDevice || isWindowsPhone || isKindle;

    const browserIsIE11 = navigator.userAgent.match(/Trident.*rv[ :]*11\./) !== null;

    const browserIsOpera = navigator.userAgent.toLowerCase().match(/opera/i) !== null || navigator.userAgent.toLowerCase().match(/OPR\//i) !== null;

    const browserIsFirefox = navigator.userAgent.toLowerCase().match(/firefox/i) !== null;

    return {
        isIPhoneDevice,
        isIPadDevice,
        isIPodDevice,
        isIOSDevice,
        isAndroidDevice,
        isHPDevice,
        isPlaybookDevice,
        isBlackBerryDevice,
        isWindowsPhone,
        isKindle,
        isMobileDevice,
        browserIsIE11,
        browserIsOpera,
        browserIsFirefox
    };
}