import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

import { Provider } from './Store';
import projectConfig from './projects/the-eternal-love-jan-2020/project-config';
import App from './projects/the-eternal-love-jan-2020/App';

ReactDOM.render(
    <Provider initialState={projectConfig}>
        <App />
    </Provider>,
    document.getElementById('root')
);

serviceWorker.unregister();
