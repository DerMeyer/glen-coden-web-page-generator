import React, { createContext, useReducer } from 'react';
import { getBreakPointType, getDeviceType, getOrientationType } from './helpers';
import reducer from './reducer';

const initStore = initialState => {
    return {
        showApp: false,
        loading: 0,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        contentWidth: 0,
        contentHeight: 0,
        breakPointType: getBreakPointType(),
        deviceType: getDeviceType(),
        orientationType: getOrientationType(),
        ...initialState
    };
};

const Store = createContext({});

export function Provider({ initialState, children }) {
    const [globalState, dispatch] = useReducer(reducer, initialState, initStore);
    return (
        <Store.Provider value={{ globalState, dispatch }}>
            {children}
        </Store.Provider>
    );
}

export default Store;
