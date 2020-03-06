import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { Provider } from './js/Store';
import App from './App';
import ConfigService from './js/services/ConfigService';
import { getInitialState } from './js/helpers';
import CONFIG from './project-config';

export const configService = new ConfigService(CONFIG.app);

const initialState = getInitialState(CONFIG.app);

ReactDOM.render(
    <Provider initialState={initialState}>
        <App />
    </Provider>,
    document.getElementById('root')
);

serviceWorker.unregister();
