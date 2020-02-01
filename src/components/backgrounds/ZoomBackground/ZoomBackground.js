import React, { useState, useEffect } from 'react';
import styles from './ZoomBackground.module.css';

import Image from '../../../partials/Image/Image';

// IDEAS
// make use of devicemotion and/or deviceorientation events for mobile design, once they are broadly supported

// config
const backgroundColor = '#b7b7b7';
const backgroundImage = 'the-eternal-love-jan-2020/images/etl-bg-2019.jpg';
const zoomFactor = 4; // growth in %
const transitionTime = 0.5; // seconds


export default function ZoomBackground(props) {
    const [zoomActive, setZoomActive] = useState(false);
    const [boxTransform, setBoxTransform] = useState({ x: 0, y: 0 });

    const growZoomBg = () => {
        setZoomActive(true);
    };

    const shrinkZoomBg = () => {
        setZoomActive(false);
    };

    const calculateBoxTransform = event => {
        const xFromCenter = event.clientX - (window.innerWidth / 2);
        const yFromCenter = event.clientY - (window.innerHeight / 2);
        setBoxTransform({
            x: xFromCenter / (window.innerWidth / 2) * zoomFactor / 2,
            y: yFromCenter / (window.innerHeight / 2) * zoomFactor / 2
        });
    };

    const onMousemove = event => {
        growZoomBg();
        calculateBoxTransform(event);
    };

    useEffect(() => {
        window.addEventListener('mousemove', onMousemove);
        window.addEventListener('blur', shrinkZoomBg);
        document.addEventListener('mouseleave', shrinkZoomBg);

        return () => {
            window.removeEventListener('mousemove', onMousemove);
            window.removeEventListener('blur', shrinkZoomBg);
            document.removeEventListener('mouseleave', shrinkZoomBg);
        };
    }, []);

    return (
        <div
            className={styles.background}
            style={{
                height: `${window.innerHeight}px`,
                backgroundColor
            }}
        >
            <div
                className={styles.zoomBox}
                style={{
                    width: zoomActive ? '100%' : '0',
                    height: zoomActive ? '100%' : '0',
                    transform: `translate(-${50 + boxTransform.x}%, -${50 + boxTransform.y}%)`,
                    transition: `width ${transitionTime}s, height ${transitionTime}s`
                }}
            >
                <Image
                    className={styles.image}
                    style={{ transition: `width ${transitionTime}s, height ${transitionTime}s` }}
                    source={backgroundImage}
                    width={zoomActive ? window.innerWidth * (1 + zoomFactor / 100) : window.innerWidth}
                    height={zoomActive ? window.innerHeight * (1 + zoomFactor / 100) : window.innerHeight}
                />
            </div>
            {props.children}
        </div>
    );
}