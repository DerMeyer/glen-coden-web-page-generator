import React from 'react';

import ZoomBackground from './components/backgrounds/ZoomBackground/ZoomBackground';
import LoadingOverlay from './components/overlays/LoadingOverlay/LoadingOverlay';


export default function _Project() {
    return (
        <>
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
        </>
    );
}