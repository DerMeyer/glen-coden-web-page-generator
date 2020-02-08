import React, { createContext, useReducer } from 'react';

// enums

const ActionTypes = {
    SHOW_APP: 'show-app',
    RESIZE: 'resize',
    START_LOADING: 'start-loading',
    STOP_LOADING: 'stop-loading',
    LOADING_TIMEOUT: 'loading-timeout'
};

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

// helpers

function getBreakPointType(viewportWidth = window.innerWidth) {
    return Object.keys(BreakPoints).find(type => BreakPoints[type] > viewportWidth);
}

function getDeviceType() {
    return typeof window.orientation !== "undefined" || navigator.userAgent.includes('IEMobile')
        ? DeviceTypes.MOBILE
        : DeviceTypes.DESKTOP;
}

function getOrientationType() {
    const orientation = window.screen.orientation;
    return typeof orientation === 'string' && orientation.includes('portrait')
        ? OrientationTypes.PORTRAIT
        : OrientationTypes.LANDSCAPE;
}

// action creators

export const actions = {
    showApp: () => ({
        type: ActionTypes.SHOW_APP
    }),
    resizeApp: (width, height) => ({
        type: ActionTypes.RESIZE,
        sizeTo: { width, height },
        breakPointType: getBreakPointType(width),
        deviceType: getDeviceType(),
        orientationType: getOrientationType()
    }),
    startLoading: () => ({
        type: ActionTypes.START_LOADING
    }),
    stopLoading: () => ({
        type: ActionTypes.STOP_LOADING
    }),
    loadingTimeout: () => ({
        type: ActionTypes.LOADING_TIMEOUT
    })
};

// reducer

const reducer = (state, action) => {
    switch (action.type) {
        case ActionTypes.SHOW_APP:
            return {
                ...state,
                showApp: true
            };
        case ActionTypes.RESIZE:
            return {
                ...state,
                viewportWidth: action.sizeTo.width,
                viewportHeight: action.sizeTo.height,
                breakPointType: action.breakPointType,
                deviceType: action.deviceType,
                orientationType: action.orientationType
            };
        case ActionTypes.START_LOADING:
            return {
                ...state,
                loading: state.loading + 1
            };
        case ActionTypes.STOP_LOADING:
            return {
                ...state,
                loading: Math.max(state.loading - 1, 0)
            };
        case ActionTypes.LOADING_TIMEOUT:
            return {
                ...state,
                loading: 0
            };
        default:
            return state;
    }
};

// store

const init = initialState => {
    return {
        showApp: false,
        loading: 0,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        breakPointType: getBreakPointType(),
        deviceType: getDeviceType(),
        orientationType: getOrientationType(),
        ...initialState
    };
};

const Store = createContext({});

export function Provider({ initialState, children }) {
    const [globalState, dispatch] = useReducer(reducer, initialState, init);
    return (
        <Store.Provider value={{ globalState, dispatch }}>
            {children}
        </Store.Provider>
    );
}

export default Store;
