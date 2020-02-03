import React, { createContext, useReducer } from 'react';

// enums

const LoadingFragment = {
    APP: 'app',
};

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
