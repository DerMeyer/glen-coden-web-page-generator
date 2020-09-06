import React, { createContext, useReducer } from 'react';
import { getBreakPointType, getDeviceType, getOrientationType } from '../js/helpers';
import reducer from './reducer';

const initStore = initialState => {
    return {
        showApp: false,
        loading: [],
        vw: window.innerWidth,
        vh: window.innerHeight,
        breakPointType: getBreakPointType(),
        deviceType: getDeviceType(),
        orientationType: getOrientationType(),
        language: navigator.language.slice(0, 2),
        ...initialState
    };
};

const Store = createContext({});

export function Provider({ initialState, children }) {
    const [state, dispatch] = useReducer(reducer, initialState, initStore);
    return (
        <Store.Provider value={{ state, dispatch }}>
            {children}
        </Store.Provider>
    );
}

export default Store;
