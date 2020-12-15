import React, { useContext, useEffect } from 'react';
import Store from './store/Store';
import actions from './store/actions';
import { configService, imageService, trackingService } from './index';

import Project from './_Project';


export default function App() {
    const { state, dispatch } = useContext(Store);

    configService.setBreakpointType(state.breakPointType);

    const { global, theme } = configService.getProps();

    console.log('APP (state): ', JSON.stringify(state, null, 4));// TODO remove dev code

    useEffect(() => {
        if (!state.initialViewComplete) {
            Promise.all([
                new Promise(resolve => {
                    imageService.onAllCompsInitiated(resolve, global.loadingTimeout);
                })
            ])
                .then(() => {
                    trackingService.pageLoaded();
                    dispatch(actions.onInitialViewComplete());
                });

            if (typeof global.bg === 'string' && [ '.png', '.jpg', '.jpeg', '.JPG' ].some(type => global.bg.endsWith(type))) {
                document.body.style.backgroundImage = `url("${global.bg}")`;
                document.body.style.backgroundRepeat = 'no-repeat';
                document.body.style.backgroundPosition = 'center';
                document.body.style.backgroundSize = 'cover';
            } else {
                document.body.style.backgroundColor = global.bg;
            }

            if (theme.fonts && theme.fonts.body) {
                document.body.style.fontFamily = theme.fonts.body;
            }

            if (theme.fontWeights && theme.fontWeights.body) {
                document.body.style.fontWeight = theme.fontWeights.body;
            }

            if (theme.lineHeights && theme.lineHeights.body) {
                document.body.style.lineHeight = theme.lineHeights.body;
            }
        }

        const resizeApp = event => dispatch(actions.resize(event.target.innerWidth, event.target.innerHeight));

        window.addEventListener('resize', resizeApp);
        window.addEventListener('orientationchange', resizeApp);

        return () => {
            window.removeEventListener('resize', resizeApp);
            window.removeEventListener('orientationchange', resizeApp);
        };
    }, [ state.initialViewComplete, dispatch, global, theme ]);

    return (
        <div style={{
            opacity: state.initialViewComplete ? '1' : '0',
            transition: `opacity ${global.fadeInTime}s`
        }}>
            <Project/>
        </div>
    );
}
