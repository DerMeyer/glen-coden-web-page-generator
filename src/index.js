import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './reset.css';
import App from './App';
import store from './app/store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import RequestService from './app/services/requestService/RequestService';
import TrackingService from './app/services/trackingService/TrackingService';
import ConfigService from './app/services/configService/ConfigService';
import ImageService from './app/services/imageService/ImageService';
import projectInfo from './project-info.json';

window.projectInfo = projectInfo;

export const requestService = new RequestService();
export const trackingService = new TrackingService();
export const configService = new ConfigService();
export const imageService = new ImageService();

Promise.all([
    requestService.init(),
    trackingService.init(),
    configService.init(),
    imageService.init()
])
    .then(() => {
        trackingService.callRender();

        ReactDOM.render(
            <Provider store={store}>
                <App />
            </Provider>,
            document.getElementById('root')
        );

        serviceWorker.unregister();
    })
    .catch(err => console.error(err));