import React, { useState, useEffect } from 'react';
import styles from './ZoomBackground.module.css';

import Image from '../../Image/Image';

const zoomFactor = 2; // side overlap in %
const transitionTime = 0.5; // seconds


export default function ZoomBackground() {
    const [zoomActive, setZoomActive] = useState(false);
    const [boxTransform, setBoxTransform] = useState('');

    function calculateBoxTransform(event) {
        const xFromCenter = event.clientX - (window.innerWidth / 2);
        const yFromCenter = event.clientY - (window.innerHeight / 2);
        const transformX = xFromCenter / (window.innerWidth / 2) * zoomFactor;
        const transformY = yFromCenter / (window.innerHeight / 2) * zoomFactor;
        setBoxTransform(`translate(-${50 + transformX}%, -${50 + transformY}%)`);
    }

    useEffect(() => {
        function growZoomBg() {
            if (zoomActive) {
                return;
            }
            setZoomActive(true);
        }

        function shrinkZoomBg() {
            if (!zoomActive) {
                return;
            }
            setZoomActive(false);
        }

        function onMousemove(event) {
            growZoomBg();
            calculateBoxTransform(event);
        }

        window.addEventListener('mousemove', onMousemove);
        window.addEventListener('blur', shrinkZoomBg);
        document.addEventListener('mouseleave', shrinkZoomBg);

        return () => {
            window.removeEventListener('mousemove', onMousemove);
            window.removeEventListener('blur', shrinkZoomBg);
            document.removeEventListener('mouseleave', shrinkZoomBg);
        };
    }, [zoomActive]);

    return (
        <div
            className={styles.background}
            style={{ height: `${window.innerHeight}px` }}
        >
            <div
                className={styles.zoomBox}
                style={{
                    width: zoomActive ? '100%' : '0',
                    height: zoomActive ? '100%' : '0',
                    transform: boxTransform,
                    transition: `width ${transitionTime}s, height ${transitionTime}s`
                }}
            >
                <div
                    className={styles.image}
                    style={{
                        width: `${window.innerWidth + (zoomActive ? (zoomFactor * 2 * window.innerWidth / 100) : 0)}px`,
                        height: `${window.innerHeight + (zoomActive ? (zoomFactor * 2 * window.innerHeight / 100) : 0)}px`,
                        transition: `width ${transitionTime}s, height ${transitionTime}s`
                    }}
                >
                    <Image
                        source="etl/images/etl-bg-2019.jpg"
                    />
                </div>
            </div>
            <div className={styles.headline}>
                The Eternal Love
            </div>
        </div>
    );
}