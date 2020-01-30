import React, { useRef, useState, useEffect } from 'react';
import styles from './ZoomBackground.module.css';

import Image from '../../Image/Image';

const backgroundColor = '#b7b7b7';
const backgroundImage = 'etl/images/etl-bg-2019.jpg';
const zoomFactor = 4; // growth in %
const transitionTime = 0.5; // seconds


export default function ZoomBackground(props) {
    const zoomBox = useRef(null);

    const [zoomActive, setZoomActive] = useState(false);

    const growZoomBg = () => {
        setZoomActive(true);
    };

    const shrinkZoomBg = () => {
        setZoomActive(false);
    };

    const calculateBoxTransform = event => {
        const xFromCenter = event.clientX - (window.innerWidth / 2);
        const yFromCenter = event.clientY - (window.innerHeight / 2);
        const transformX = xFromCenter / (window.innerWidth / 2) * zoomFactor / 2;
        const transformY = yFromCenter / (window.innerHeight / 2) * zoomFactor / 2;

        if (zoomBox.current) {
            zoomBox.current.style.transform = `translate(-${50 + transformX}%, -${50 + transformY}%)`;
        }
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
    });

    return (
        <div
            className={styles.background}
            style={{
                height: `${window.innerHeight}px`,
                backgroundColor
            }}
        >
            <div
                ref={zoomBox}
                className={styles.zoomBox}
                style={{
                    width: zoomActive ? '100%' : '0',
                    height: zoomActive ? '100%' : '0',
                    transition: `width ${transitionTime}s, height ${transitionTime}s`
                }}
            >
                <div
                    className={styles.imageBox}
                    style={{
                        width: zoomActive ? `${window.innerWidth * (1 + zoomFactor / 100)}px` : `${window.innerWidth}px`,
                        height: zoomActive ? `${window.innerHeight * (1 + zoomFactor / 100)}px` : `${window.innerHeight}px`,
                        transition: `width ${transitionTime}s, height ${transitionTime}s`
                    }}
                >
                    <Image
                        source={backgroundImage}
                    />
                </div>
            </div>
            {props.children}
        </div>
    );
}