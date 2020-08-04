import React, { useContext, useEffect } from 'react';
import Store from './store/Store';
import actions from './store/actions';
import { configService } from './index';

import Project from './_Project';


export default function App() {
    const { state, dispatch } = useContext(Store);
    const { global } = configService.getProps();

    useEffect(() => {
        document.body.style.fontSize = `${global.fontSizes.body}px`;
        document.body.style.backgroundColor = global.colors.background;

        window.setTimeout(() => dispatch(actions.showApp()), global.fadeInTime * 1000);
        window.setTimeout(() => dispatch(actions.loadingTimeout()), global.loadingTimeout * 1000);

        const resizeApp = event => dispatch(actions.resize(event.target.innerWidth, event.target.innerHeight));

        window.addEventListener('resize', resizeApp);
        window.addEventListener('orientationchange', resizeApp);

        return () => {
            window.removeEventListener('resize', resizeApp);
            window.removeEventListener('orientationchange', resizeApp);
        };
    }, [ dispatch, global ]);

    useEffect(() => {
        dispatch(actions.setContentSize(state.deviceType, global.pageContentSize));
    }, [ dispatch, state.deviceType, global.pageContentSize ]);

    return (
        <div style={{
            opacity: state.showApp ? '1' : '0',
            transition: `opacity ${global.fadeInTime}s`
        }}>
            <Project/>
        </div>
    );
}
