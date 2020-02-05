import React, { useContext, useState, useEffect } from 'react';
import styles from './ZoomBackground.module.css';
import Store from '../../../Store';
import { projectConfig } from '../../../index';

import Image from '../../partials/Image/Image';

// IDEAS
// make use of devicemotion and/or deviceorientation events for mobile design, once they are broadly supported


export default function ZoomBackground(props) {
    const { globalState } = useContext(Store);
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
        const xFromCenter = event.clientX - (globalState.viewportWidth / 2);
        const yFromCenter = event.clientY - (globalState.viewportHeight / 2);
        setBoxTransform({
            x: xFromCenter / (globalState.viewportWidth / 2) * config.zoomFactor / 2,
            y: yFromCenter / (globalState.viewportHeight / 2) * config.zoomFactor / 2
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
                height: `${globalState.viewportHeight}px`,
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
                    width={zoomActive ? globalState.viewportWidth * (1 + config.zoomFactor / 100) : globalState.viewportWidth}
                    height={zoomActive ? globalState.viewportHeight * (1 + config.zoomFactor / 100) : globalState.viewportHeight}
                />
            </div>
            {props.children}
        </div>
    );
}