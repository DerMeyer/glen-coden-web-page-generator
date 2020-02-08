import React, { useContext, useEffect } from 'react';
import Store, { actions } from '../../Store';

import ZoomBackground from '../../components/backgrounds/ZoomBackground/ZoomBackground';
import LoadingOverlay from '../../components/overlays/LoadingOverlay/LoadingOverlay';
import { projectConfig } from '../../index';

import {ReactComponent as InstagramIcon} from '../../components/svg/instagram.svg';


export default function App() {
    const { globalState, dispatch } = useContext(Store);

    console.log(globalState);// TODO remove dev code

    useEffect(() => {
        document.body.style.backgroundColor = projectConfig.style.backgroundColor;

        window.setTimeout(() => dispatch(actions.showApp()), projectConfig.fadeInTime * 1000);
        window.setTimeout(() => dispatch(actions.loadingTimeout()), projectConfig.loadingTimeout * 1000);

        const resizeApp = () => dispatch(actions.resizeApp(window.innerWidth, window.innerHeight));

        window.addEventListener('resize', resizeApp);
        window.addEventListener('orientationchange', resizeApp);

        return () => {
            window.removeEventListener('resize', resizeApp);
            window.removeEventListener('orientationchange', resizeApp);
        };
    }, [dispatch]);

    return (
        <div style={{ opacity: globalState.showApp ? '1' : '0', transition: `opacity ${projectConfig.fadeInTime}s` }}>
            <ZoomBackground chain={[]}>
                <div style={{
                    position: 'fixed',
                    left: '6%',
                    bottom: '55px',
                    fontFamily: 'Comfortaa',
                    fontSize: '55px',
                    fontWeight: 'bold',
                    color: 'white',
                    whiteSpace: 'nowrap'
                }}>
                    The Eternal Love
                </div>
            </ZoomBackground>
            <LoadingOverlay chain={[]} />
            <div style={{ width: '50px', fill: 'white' }}>
                <InstagramIcon />
            </div>
        </div>
    );
}
