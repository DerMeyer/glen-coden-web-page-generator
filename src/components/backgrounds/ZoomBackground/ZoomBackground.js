import React, { useContext, useState, useEffect } from 'react';
import styles from './ZoomBackground.module.css';
import Store, { DeviceTypes } from '../../../Store';
import { getComponentConfig } from '../../../index';

import Image from '../../partials/Image/Image';

// IDEAS
// make use of devicemotion and/or deviceorientation events for mobile design, once they are broadly supported


export default function ZoomBackground(props) {
    const { globalState } = useContext(Store);
    const config = getComponentConfig(props.chain, 'ZoomBackground');
    const deviceIsMobile = globalState.deviceType === DeviceTypes.MOBILE;
    const zoomFactor = deviceIsMobile ? config.zoomFactorMobile : config.zoomFactor;
    const zoomTime = deviceIsMobile ? config.zoomTimeMobile : config.zoomTime;

    const [zoomActive, setZoomActive] = useState(false);
    const [boxTransform, setBoxTransform] = useState({ x: 0, y: 0 });

    useEffect(() => {
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
                x: xFromCenter / (globalState.viewportWidth / 2) * zoomFactor / 2,
                y: yFromCenter / (globalState.viewportHeight / 2) * zoomFactor / 2
            });
        };

        const onMousemove = event => {
            growZoomBg();
            calculateBoxTransform(event);
        };

        if (globalState.loading) {
            shrinkZoomBg();
            return;
        }

        if (deviceIsMobile) {
            growZoomBg();
            return;
        }

        window.addEventListener('mousemove', onMousemove);
        window.addEventListener('blur', shrinkZoomBg);
        document.addEventListener('mouseleave', shrinkZoomBg);

        return () => {
            window.removeEventListener('mousemove', onMousemove);
            window.removeEventListener('blur', shrinkZoomBg);
            document.removeEventListener('mouseleave', shrinkZoomBg);
        };
    }, [
        globalState.viewportWidth,
        globalState.viewportHeight,
        zoomFactor,
        globalState.loading,
        deviceIsMobile
    ]);

    return (
        <div
            className={styles.background}
            style={{ height: `${globalState.viewportHeight}px` }}
        >
            <div
                className={styles.zoomBox}
                style={{
                    width: zoomActive ? '100%' : '0',
                    height: zoomActive ? '100%' : '0',
                    transform: `translate(-${50 + boxTransform.x}%, -${50 + boxTransform.y}%)`,
                    transition: `width ${zoomTime}s, height ${zoomTime}s`
                }}
            >
                <Image
                    className={styles.image}
                    style={{ transition: `width ${zoomTime}s, height ${zoomTime}s` }}
                    source={config.image}
                    width={zoomActive ? Math.ceil(globalState.viewportWidth * (1 + zoomFactor / 100)) : globalState.viewportWidth}
                    height={zoomActive ? Math.ceil(globalState.viewportHeight * (1 + zoomFactor / 100)) : globalState.viewportHeight}
                />
            </div>
            {props.children}
        </div>
    );
}