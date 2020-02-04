import React, { useState, useEffect } from 'react';
import styles from './ZoomBackground.module.css';
import { projectConfig } from '../../../index';

import Image from '../../partials/Image/Image';

// IDEAS
// make use of devicemotion and/or deviceorientation events for mobile design, once they are broadly supported


export default function ZoomBackground(props) {
    const config = projectConfig.components.ZoomBackground;

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
            x: xFromCenter / (window.innerWidth / 2) * config.zoomFactor / 2,
            y: yFromCenter / (window.innerHeight / 2) * config.zoomFactor / 2
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
                backgroundColor: config.style.backgroundColor
            }}
        >
            <div
                className={styles.zoomBox}
                style={{
                    width: zoomActive ? '100%' : '0',
                    height: zoomActive ? '100%' : '0',
                    transform: `translate(-${50 + boxTransform.x}%, -${50 + boxTransform.y}%)`,
                    transition: `width ${config.transitionTime}s, height ${config.transitionTime}s`
                }}
            >
                <Image
                    className={styles.image}
                    style={{ transition: `width ${config.transitionTime}s, height ${config.transitionTime}s` }}
                    source={config.image}
                    width={zoomActive ? window.innerWidth * (1 + config.zoomFactor / 100) : window.innerWidth}
                    height={zoomActive ? window.innerHeight * (1 + config.zoomFactor / 100) : window.innerHeight}
                />
            </div>
            {props.children}
        </div>
    );
}