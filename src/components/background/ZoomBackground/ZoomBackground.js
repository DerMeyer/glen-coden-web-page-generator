import React, { useContext, useState, useCallback, useEffect } from 'react';
import styles from './ZoomBackground.module.css';
import Store from '../../../js/Store';
import { configService } from '../../../index';
import { DeviceTypes } from '../../../js/helpers';

import Image from '../../../partials/Image/Image';

// IDEAS
// make use of devicemotion and/or deviceorientation events for mobile design, once they are broadly supported


export default function ZoomBackground(props) {
    const { globalState } = useContext(Store);

    const [config] = useState(() => configService.getComponentConfig(props.id));
    const [zoomActive, setZoomActive] = useState(false);
    const [boxTransform, setBoxTransform] = useState({ x: 0, y: 0 });

    const deviceIsMobile = globalState.deviceType === DeviceTypes.MOBILE;
    const autoZoom = config.autoZoom || deviceIsMobile;
    const zoomFactor = autoZoom ? config.zoomFactorAuto : config.zoomFactor;
    const zoomTime = autoZoom ? config.zoomTimeAuto : config.zoomTime;

    const growZoomBg = useCallback(() => setZoomActive(true), []);

    const shrinkZoomBg = useCallback(() => setZoomActive(false), []);

    const calculateBoxTransform = useCallback(
        event => {
            const xFromCenter = event.clientX - (globalState.viewportWidth / 2);
            const yFromCenter = event.clientY - (globalState.viewportHeight / 2);
            setBoxTransform({
                x: xFromCenter / (globalState.viewportWidth / 2) * zoomFactor / 2,
                y: yFromCenter / (globalState.viewportHeight / 2) * zoomFactor / 2
            });
        },
        [globalState.viewportWidth, globalState.viewportHeight, zoomFactor]
    );

    useEffect(() => {
        if (globalState.loading) {
            shrinkZoomBg();
            return;
        }
        if (autoZoom) {
            growZoomBg();
            return;
        }
        const onMousemove = event => {
            growZoomBg();
            calculateBoxTransform(event);
        };
        window.addEventListener('mousemove', onMousemove);
        window.addEventListener('blur', shrinkZoomBg);
        document.addEventListener('mouseleave', shrinkZoomBg);
        return () => {
            window.removeEventListener('mousemove', onMousemove);
            window.removeEventListener('blur', shrinkZoomBg);
            document.removeEventListener('mouseleave', shrinkZoomBg);
        };
    }, [growZoomBg, shrinkZoomBg, calculateBoxTransform, globalState.loading, autoZoom]);

    return (
        <div
            className={styles.background}
            style={{
                width: `${globalState.viewportWidth}px`,
                height: `${globalState.viewportHeight}px`
            }}
        >
            <div
                className={styles.zoomBox}
                style={{
                    width: zoomActive || autoZoom ? '100%' : '0',
                    height: zoomActive || autoZoom ? '100%' : '0',
                    transform: `translate(-${50 + boxTransform.x}%, -${50 + boxTransform.y}%)`,
                    transition: `width ${zoomTime}s ${config.timingFunction}, height ${zoomTime}s ${config.timingFunction}`
                }}
            >
                <Image
                    className={styles.image}
                    style={{
                        transform: `scale(${zoomActive ? (1 + zoomFactor / 100) : 1})`,
                        transition: `transform ${zoomTime}s ${config.timingFunction}`
                    }}
                    source={config.image}
                    width={globalState.viewportWidth}
                    height={globalState.viewportHeight}
                    loadWithCss={config.loadImageWithCss}
                />
            </div>
            {props.children}
        </div>
    );
}