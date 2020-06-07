import React, { useContext, useEffect } from 'react';
import Store from './store/Store';
import actions from './store/actions';
import { configService } from './index';

import Project from './_Project';


export default function App() {
    const { state, dispatch } = useContext(Store);
    const config = configService.getProps();

    useEffect(() => {
        document.body.style.fontSize = `${config.fontSizes.body}px`;
        document.body.style.backgroundColor = config.colors.background;

        window.setTimeout(() => dispatch(actions.showApp()), config.fadeInTime * 1000);
        window.setTimeout(() => dispatch(actions.loadingTimeout()), config.loadingTimeout * 1000);

        const resizeApp = event => dispatch(actions.resize(event.target.innerWidth, event.target.innerHeight));

        window.addEventListener('resize', resizeApp);
        window.addEventListener('orientationchange', resizeApp);

        return () => {
            window.removeEventListener('resize', resizeApp);
            window.removeEventListener('orientationchange', resizeApp);
        };
    }, [ dispatch, config ]);

    useEffect(() => {
        dispatch(actions.setContentSize(state.deviceType, config.pageContentSize));
    }, [ dispatch, state.deviceType, config.pageContentSize ]);

    return (
        <div style={{
            opacity: state.showApp ? '1' : '0',
            transition: `opacity ${config.fadeInTime}s`
        }}>
            <Project/>
        </div>
    );
}
