import React, { useContext, useEffect } from 'react';
import styles from './App.module.css';
import Store, { actions } from '../../Store';

import ZoomBackground from '../../components/backgrounds/ZoomBackground/ZoomBackground';
import LoadingOverlay from '../../components/overlays/LoadingOverlay/LoadingOverlay';
import { projectConfig } from '../../index';


export default function App() {
    const { dispatch } = useContext(Store);

    const resizeApp = () => dispatch(actions.resizeApp(window.innerWidth, window.innerHeight));

    useEffect(() => {
        window.setTimeout(() => dispatch(actions.loadingTimeout()), projectConfig.global.loadingTimeout * 1000);
        window.addEventListener('resize', resizeApp);
        window.addEventListener('orientationchange', resizeApp);
        return () => {
            window.removeEventListener('resize', resizeApp);
            window.removeEventListener('orientationchange', resizeApp);
        };
    }, []);

    return (
        <div className={styles.app}>
            <ZoomBackground>
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
            <LoadingOverlay />
        </div>
    );
}
