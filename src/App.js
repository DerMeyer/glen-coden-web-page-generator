import React, { useContext, useState, useEffect } from 'react';
import Store from './js/Store';
import actions from './js/actions';
import { configService } from './index';

import Project from './_Project';


export default function App() {
    const { state, dispatch } = useContext(Store);
    const [ projectConfig ] = useState(() => configService.getProjectConfig());

    useEffect(() => {
        document.body.style.fontSize = `${projectConfig.style.fontSizes.body}px`;
        document.body.style.backgroundColor = projectConfig.style.colors.background;

        window.setTimeout(() => dispatch(actions.showApp()), projectConfig.fadeInTime * 1000);
        window.setTimeout(() => dispatch(actions.loadingTimeout()), projectConfig.loadingTimeout * 1000);

        const resizeApp = event => dispatch(actions.resize(event.target.innerWidth, event.target.innerHeight));

        window.addEventListener('resize', resizeApp);
        window.addEventListener('orientationchange', resizeApp);

        return () => {
            window.removeEventListener('resize', resizeApp);
            window.removeEventListener('orientationchange', resizeApp);
        };
    }, [ dispatch, projectConfig ]);

    useEffect(() => {
        dispatch(actions.setContentSize(state.deviceType, projectConfig.style.pageContentSize));
    }, [ dispatch, projectConfig, state.deviceType ]);

    return (
        <div style={{
            opacity: state.showApp ? '1' : '0',
            transition: `opacity ${projectConfig.fadeInTime}s`
        }}>
            <Project/>
        </div>
    );
}
