import React from 'react';
import Store from '../../Store';
import projectConfig from './project-config';

import ZoomBackground from '../../components/backgrounds/ZoomBackground/ZoomBackground';


export default function App() {
    console.log(`=============== ${projectConfig.name} ===============`);

    return (
        <Store.Provider value={projectConfig}>
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
        </Store.Provider>
    );
}
