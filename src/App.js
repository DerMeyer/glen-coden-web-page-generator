import React, { useContext, useEffect } from 'react';
import Store from './store/Store';
import actions from './store/actions';
import { configService } from './index';

import Project from './_Project';


export default function App() {
    const { state, dispatch } = useContext(Store);
    const global = configService.getProps();

    console.log('APP', JSON.stringify(state, null, 4));// TODO remove dev code

    useEffect(() => configService.setBreakpointType(state.breakPointType), [ state.breakPointType ]);

    useEffect(() => {
        document.documentElement.style.fontSize = `${global.fontSizes[0]}px`;
        document.body.style.backgroundColor = global.bgColor;

        window.setTimeout(() => dispatch(actions.showApp()), global.timeTilFadeIn * 1000);
        window.setTimeout(() => dispatch(actions.loadingTimeout()), global.loadingTimeout * 1000);

        const resizeApp = event => dispatch(actions.resize(event.target.innerWidth, event.target.innerHeight));

        window.addEventListener('resize', resizeApp);
        window.addEventListener('orientationchange', resizeApp);

        return () => {
            window.removeEventListener('resize', resizeApp);
            window.removeEventListener('orientationchange', resizeApp);
        };
    }, [ dispatch, global ]);

    return (
        <div style={{
            opacity: state.showApp ? '1' : '0',
            transition: `opacity ${global.fadeInTime}s`
        }}>
            <Project/>
        </div>
    );
}
