import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

import { Provider } from './Store';
import projectMap from './projects/the-eternal-love-jan-2020/project-map';

import App from './projects/the-eternal-love-jan-2020/App';


// calculate initial state and project config

const { name, style, components } = projectMap;

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
    components: componentConfig
};


ReactDOM.render(
    <Provider initialState={initialState}>
        <App />
    </Provider>,
    document.getElementById('root')
);

serviceWorker.unregister();
