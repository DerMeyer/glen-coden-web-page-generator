import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { Provider } from './js/Store';
import App from './App';
import ConfigService from './js/services/ConfigService';
import PROJ_CONFIG from './project-config';

export const configService = new ConfigService();

Promise.all([
    Promise.resolve()
        .then(() => fetch('config.json'))
        .then(response => response.json())
        .then(USER_CONFIG => {
            const CONFIG = process.env.NODE_ENV && process.env.NODE_ENV === 'production' ? USER_CONFIG : PROJ_CONFIG;
            configService.init(CONFIG);
        })
])
    .then(() => {
        const initialState = configService.getInitialState();

        ReactDOM.render(
            <Provider initialState={initialState}>
                <App />
            </Provider>,
            document.getElementById('root')
        );

        serviceWorker.unregister();
    });