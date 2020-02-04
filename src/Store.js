import React, { createContext, useReducer } from 'react';

// enums and maps

const BreakPointType = {
    MOBILE_PORTRAIT: 'mobile-portrait',
    MOBILE_LANDSCAPE: 'mobile-landscape',
    TABLET: 'tablet',
    DESKTOP_MIN: 'desktop-small',
    DESKTOP: 'desktop',
    DESKTOP_MAX: 'desktop-max'
};

const BreakPoints = {
    [BreakPointType.MOBILE_PORTRAIT]: 450,
    [BreakPointType.MOBILE_LANDSCAPE]: 850,
    [BreakPointType.TABLET]: 1050,
    [BreakPointType.DESKTOP_MIN]: 1250,
    [BreakPointType.DESKTOP]: 1450,
    [BreakPointType.DESKTOP_MAX]: 2000
};

// helpers

function getBreakPointType(viewportWidth) {
    return Object.keys(BreakPoints).find(type => BreakPoints[type] > viewportWidth);
}

// actions

const ActionType = {
    START_LOADING: 'start-loading',
    STOP_LOADING: 'stop-loading'
};

export const actions = {
    startLoading: () => ({
        type: ActionType.START_LOADING
    }),
    stopLoading: () => ({
        type: ActionType.STOP_LOADING
    })
};

// reducer

const reducer = (state, action) => {
    switch (action.type) {
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
        breakPointType: getBreakPointType(window.innerWidth),
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
