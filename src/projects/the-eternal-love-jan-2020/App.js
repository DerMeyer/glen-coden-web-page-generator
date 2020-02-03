import React from 'react';

import ZoomBackground from '../../components/backgrounds/ZoomBackground/ZoomBackground';


export default function App() {
    return (
        <>
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
        </>
    );
}
