import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { Provider } from './js/Store';
import App from './App';
import ConfigService from './js/services/ConfigService';
import { getInitialState } from './js/helpers';
import projectMap from './project-map';

export const configService = new ConfigService(projectMap);

const initialState = getInitialState(projectMap);

ReactDOM.render(
    <Provider initialState={initialState}>
        <App />
    </Provider>,
    document.getElementById('root')
);

serviceWorker.unregister();
