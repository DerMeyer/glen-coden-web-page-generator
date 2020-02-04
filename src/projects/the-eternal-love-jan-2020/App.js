import React from 'react';
import styles from './App.module.css';

import ZoomBackground from '../../components/backgrounds/ZoomBackground/ZoomBackground';
import LoadingOverlay from '../../components/overlays/LoadingOverlay/LoadingOverlay';


export default function App() {
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
