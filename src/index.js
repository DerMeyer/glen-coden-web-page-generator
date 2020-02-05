import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

import { Provider } from './Store';
import projectImports from './projectImports';
const { projectMap, App } = projectImports;

// config service

const { name, style, global, components } = projectMap;

const initialComponentState = {};
const componentConfig = {};

Object.keys(components).forEach(key => {
    initialComponentState[key] = {
        ...components[key].initialState
    };
    delete components[key].initialState;
    componentConfig[key] = {
        ...components[key],
        style: {
            ...style,
            ...components[key].style
        }
    };
});

const initialState = {
    ...projectMap.initialState,
    ...initialComponentState
};

export const projectConfig = {
    name,
    style,
    global,
    components: componentConfig
};

// react render

ReactDOM.render(
    <Provider initialState={initialState}>
        <App />
    </Provider>,
    document.getElementById('root')
);

serviceWorker.unregister();
