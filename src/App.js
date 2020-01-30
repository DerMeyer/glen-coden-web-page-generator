import React, { useEffect } from 'react';
import './App.css';

import ZoomBackground from './components/backgrounds/ZoomBackground/ZoomBackground';
import styles from './components/backgrounds/ZoomBackground/ZoomBackground.module.css';


function App() {
    useEffect(() => {
        window.addEventListener('devicemotion', () => {
            console.log('DEVICE MOTION EVENT');// TODO remove dev code
        });
        window.addEventListener('deviceorientation', () => {
            console.log('DEVICE ORIENTATION EVENT');// TODO remove dev code
        });
        return () => {
            window.removeEventListener('devicemotion', () => {
                console.log('DEVICE MOTION EVENT');// TODO remove dev code
            });
            window.removeEventListener('deviceorientation', () => {
                console.log('DEVICE ORIENTATION EVENT');// TODO remove dev code
            });
        };
    }, []);

    return (
        <div className="App">
            <ZoomBackground>
                <div className={styles.headline}>The Eternal Love</div>
            </ZoomBackground>
        </div>
    );
}

export default App;
