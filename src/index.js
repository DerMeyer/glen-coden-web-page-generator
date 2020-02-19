import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { Provider } from './js/Store';
import App from './App';
import ConfigService from './js/services/ConfigService';
import { getInitialState } from './js/helpers';
import config from './_project-config';

export const configService = new ConfigService(config);

const initialState = getInitialState(config);

ReactDOM.render(
    <Provider initialState={initialState}>
        <App />
    </Provider>,
    document.getElementById('root')
);

serviceWorker.unregister();
