import React, { useEffect } from 'react';
import './App.css';

import ZoomBackground from './components/backgrounds/ZoomBackground/ZoomBackground';


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
            <ZoomBackground />
        </div>
    );
}

export default App;
