import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { Provider } from './js/Store';
import App from './App';
import ConfigService from './js/services/ConfigService';
import { getInitialState } from './js/helpers';
import PROJ_CONFIG from './project-config';

export const configService = new ConfigService(PROJ_CONFIG);

const initialState = getInitialState(PROJ_CONFIG);

ReactDOM.render(
    <Provider initialState={initialState}>
        <App />
    </Provider>,
    document.getElementById('root')
);

serviceWorker.unregister();
