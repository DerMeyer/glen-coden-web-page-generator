import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

import { Provider } from './Store';
import projectImports from './projectImports';
const { projectMap, App } = projectImports;

// config service

const { name, style, global, components } = projectMap;

export const projectConfig = {
    name,
    style,
    ...global
};

const componentsInitialState = {};
const componentsConfig = {};

Object.keys(components).forEach(key => {
    componentsInitialState[key] = {
        ...components[key].initialState
    };
    delete components[key].initialState;
    componentsConfig[key] = {
        ...components[key],
        style: {
            ...style,
            ...components[key].style
        }
    };
});

export function getComponentConfig(chain, componentName) {
    return [...chain, componentName].reduce((result, child) => result[child], componentsConfig);
}

export function getComponentState(chain, componentName, state) {
    return [...chain, componentName].reduce((result, child) => result[child], state);
}

const initialState = {
    ...projectMap.initialState,
    ...componentsInitialState
};

// react render

ReactDOM.render(
    <Provider initialState={initialState}>
        <App />
    </Provider>,
    document.getElementById('root')
);

serviceWorker.unregister();
