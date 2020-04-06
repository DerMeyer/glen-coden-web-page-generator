import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { Provider } from './js/Store';
import App from './App';
import ConfigService from './js/services/ConfigService';

export const configService = new ConfigService();

Promise.all([
    Promise.resolve()
        .then(() => fetch('/config.json'))
        .then(response => response.json())
        .then(config => configService.init(config))
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