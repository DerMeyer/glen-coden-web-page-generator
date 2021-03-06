import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { configService, imageService, trackingService } from './index';
import { setBgStyle } from './app/lib/util';
import { onInitialViewComplete, resize } from './app/appSlice';

import Project from './_Project';
import LoadingSign from './features/partial/LoadingSign/LoadingSign';


export default function App() {
    const initialViewComplete = useSelector(state => state.app.initialViewComplete);
    const breakPointType = useSelector(state => state.app.breakPointType);
    const dispatch = useDispatch();

    configService.setBreakpointType(breakPointType);

    const { global, theme } = configService.getProps();

    useEffect(() => {
        if (!initialViewComplete) {
            Promise.all([
                new Promise(resolve => {
                    imageService.onAllCompsInitiated(resolve, global.loadingTimeout);
                })
            ])
                .then(() => {
                    trackingService.pageLoaded();
                    dispatch(onInitialViewComplete());
                });

            setBgStyle(global.bg, document.body.style);

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

        const resizeApp = event => dispatch(resize({ width: event.target.innerWidth, height: event.target.innerHeight }));

        window.addEventListener('resize', resizeApp);
        window.addEventListener('orientationchange', resizeApp);

        return () => {
            window.removeEventListener('resize', resizeApp);
            window.removeEventListener('orientationchange', resizeApp);
        };
    }, [ initialViewComplete, dispatch, global, theme ]);

    return (
        <>
            <div style={{
                opacity: initialViewComplete ? '1' : '0',
                transition: `opacity ${global.fadeInTime}s`
            }}>
                <Project/>
            </div>
            <LoadingSign parentVisible={initialViewComplete} />
        </>
    );
}
