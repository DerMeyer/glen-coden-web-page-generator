import React, { useContext, useState, useEffect } from 'react';
import Store from '../../../Store';
import styles from './ZoomBackground.module.css';

import Image from '../../partials/Image/Image';

// IDEAS
// make use of devicemotion and/or deviceorientation events for mobile design, once they are broadly supported


export default function ZoomBackground(props) {
    const context = useContext(Store);
    const contextStyles = context.style;
    const zoomBgContext = context.components.ZoomBackground;

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
            x: xFromCenter / (window.innerWidth / 2) * zoomBgContext.zoomFactor / 2,
            y: yFromCenter / (window.innerHeight / 2) * zoomBgContext.zoomFactor / 2
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
                backgroundColor: contextStyles.backgroundColor
            }}
        >
            <div
                className={styles.zoomBox}
                style={{
                    width: zoomActive ? '100%' : '0',
                    height: zoomActive ? '100%' : '0',
                    transform: `translate(-${50 + boxTransform.x}%, -${50 + boxTransform.y}%)`,
                    transition: `width ${zoomBgContext.transitionTime}s, height ${zoomBgContext.transitionTime}s`
                }}
            >
                <Image
                    className={styles.image}
                    style={{ transition: `width ${zoomBgContext.transitionTime}s, height ${zoomBgContext.transitionTime}s` }}
                    source={zoomBgContext.image}
                    width={zoomActive ? window.innerWidth * (1 + zoomBgContext.zoomFactor / 100) : window.innerWidth}
                    height={zoomActive ? window.innerHeight * (1 + zoomBgContext.zoomFactor / 100) : window.innerHeight}
                />
            </div>
            {props.children}
        </div>
    );
}