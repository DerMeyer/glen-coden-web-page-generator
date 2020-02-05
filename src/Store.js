import React, { createContext, useReducer } from 'react';

// enums

const ActionType = {
    RESIZE: 'resize',
    START_LOADING: 'start-loading',
    STOP_LOADING: 'stop-loading',
    LOADING_TIMEOUT: 'loading-timeout'
};

export const BreakPointType = {
    MOBILE_PORTRAIT: 'mobile-portrait',
    MOBILE_LANDSCAPE: 'mobile-landscape',
    TABLET: 'tablet',
    DESKTOP_MIN: 'desktop-small',
    DESKTOP: 'desktop',
    DESKTOP_MAX: 'desktop-max'
};

export const DeviceType = {
    MOBILE: 'mobile',
    DESKTOP: 'desktop'
};

export const OrientationType = {
    PORTRAIT: 'portrait',
    LANDSCAPE: 'landscape'
};

// maps

export const BreakPoints = {
    [BreakPointType.MOBILE_PORTRAIT]: 450,
    [BreakPointType.MOBILE_LANDSCAPE]: 850,
    [BreakPointType.TABLET]: 1050,
    [BreakPointType.DESKTOP_MIN]: 1250,
    [BreakPointType.DESKTOP]: 2000,
    [BreakPointType.DESKTOP_MAX]: Infinity
};

// helpers

function getBreakPointType(viewportWidth = window.innerWidth) {
    return Object.keys(BreakPoints).find(type => BreakPoints[type] > viewportWidth);
}

function getDeviceType() {
    return typeof window.orientation !== "undefined" || navigator.userAgent.includes('IEMobile')
        ? DeviceType.MOBILE
        : DeviceType.DESKTOP;
}

function getOrientationType() {
    const orientation = window.screen.orientation;
    return typeof orientation === 'string' && orientation.includes('portrait')
        ? OrientationType.PORTRAIT
        : OrientationType.LANDSCAPE;
}

// actions

export const actions = {
    resizeApp: (width, height) => ({
        type: ActionType.RESIZE,
        sizeTo: { width, height }
    }),
    startLoading: () => ({
        type: ActionType.START_LOADING
    }),
    stopLoading: () => ({
        type: ActionType.STOP_LOADING
    }),
    loadingTimeout: () => ({
        type: ActionType.LOADING_TIMEOUT
    })
};

// reducer

const reducer = (state, action) => {
    switch (action.type) {
        case ActionType.RESIZE:
            return {
                ...state,
                viewportWidth: action.sizeTo.width,
                viewportHeight: action.sizeTo.height,
                breakPointType: getBreakPointType(action.sizeTo.width),
                deviceType: getDeviceType(),
                orientationType: getOrientationType()
            };
        case ActionType.START_LOADING:
            return {
                ...state,
                loading: state.loading + 1
            };
        case ActionType.STOP_LOADING:
            return {
                ...state,
                loading: Math.max(state.loading - 1, 0)
            };
        case ActionType.LOADING_TIMEOUT:
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
