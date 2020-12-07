import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './reset.css';
import * as serviceWorker from './serviceWorker';
import { Provider } from './store/Store';
import App from './App';
import ConfigService from './services/configService/ConfigService';
import RequestService from './services/requestService/RequestService';
import TrackingService from './services/trackingService/TrackingService';
import ImageService from './services/imageService/ImageService';
import projectInfo from './project-info.json';

window.projectInfo = projectInfo;

export const configService = new ConfigService();
export const requestService = new RequestService();
export const trackingService = new TrackingService();
export const imageService = new ImageService();

Promise.all([
    configService.init(),
    requestService.init(),
    trackingService.init(),
    imageService.init()
])
    .then(() => {
        const initialState = configService.getInitialState();

        trackingService.callRender();

        ReactDOM.render(
            <Provider initialState={initialState}>
                <App />
            </Provider>,
            document.getElementById('root')
        );

        serviceWorker.unregister();
    })
    .catch(err => console.error(err));