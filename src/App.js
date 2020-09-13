import React, { useContext, useEffect } from 'react';
import Store from './store/Store';
import actions from './store/actions';
import { configService } from './index';

import Project from './_Project';


export default function App() {
    const { state, dispatch } = useContext(Store);
    const config = configService.getProps();
    const { global, theme } = config;

    console.log('APP (state): ', JSON.stringify(state, null, 4));// TODO remove dev code

    useEffect(() => configService.setBreakpointType(state.breakPointType), [ state.breakPointType ]);

    useEffect(() => {
        document.body.style.backgroundColor = global.bg;
        if (theme.fonts && theme.fonts.body) {
            document.body.style.fontFamily = theme.fonts.body;
        }
        if (theme.fontWeights && theme.fontWeights.body) {
            document.body.style.fontWeight = theme.fontWeights.body;
        }
        if (theme.lineHeights && theme.lineHeights.body) {
            document.body.style.lineHeight = theme.lineHeights.body;
        }

        window.setTimeout(() => dispatch(actions.showApp()), global.timeTilFadeIn * 1000);
        window.setTimeout(() => dispatch(actions.loadingTimeout()), global.loadingTimeout * 1000);

        const resizeApp = event => dispatch(actions.resize(event.target.innerWidth, event.target.innerHeight));

        window.addEventListener('resize', resizeApp);
        window.addEventListener('orientationchange', resizeApp);

        return () => {
            window.removeEventListener('resize', resizeApp);
            window.removeEventListener('orientationchange', resizeApp);
        };
    }, [ dispatch, global, theme ]);

    return (
        <div style={{
            opacity: state.showApp ? '1' : '0',
            transition: `opacity ${global.fadeInTime}s`
        }}>
            <Project/>
        </div>
    );
}
