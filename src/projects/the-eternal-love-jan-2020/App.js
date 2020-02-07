import React, { useContext, useEffect } from 'react';
import styles from './App.module.css';
import Store, { actions } from '../../Store';

import ZoomBackground from '../../components/backgrounds/ZoomBackground/ZoomBackground';
import LoadingOverlay from '../../components/overlays/LoadingOverlay/LoadingOverlay';
import { projectConfig } from '../../index';


export default function App() {
    const { globalState, dispatch } = useContext(Store);

    useEffect(() => {
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
        <div className={styles.app} style={{ opacity: globalState.showApp ? '1' : '0', transition: `opacity ${projectConfig.fadeInTime}s` }}>
            <ZoomBackground chain={[]}>
                <div style={{
                    position: 'fixed',
                    left: '6%',
                    bottom: '55px',
                    fontFamily: 'Comfortaa',
                    fontSize: '55px',
                    fontWeight: 'bold',
                    color: 'white'
                }}>
                    The Eternal Love
                </div>
            </ZoomBackground>
            <LoadingOverlay chain={[]} />
        </div>
    );
}
