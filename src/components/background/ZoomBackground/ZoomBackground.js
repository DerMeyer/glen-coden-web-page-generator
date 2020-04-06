import React, { useContext, useState, useCallback, useEffect } from 'react';
import styles from './ZoomBackground.module.css';
import Store from '../../../js/Store';
import { configService } from '../../../index';
import { DeviceTypes } from '../../../js/helpers';

import Image from '../../../partials/Image/Image';

// IDEAS
// make use of devicemotion and/or deviceorientation events for mobile design, once they are broadly supported


export default function ZoomBackground(props) {
    const { state } = useContext(Store);
    const config = configService.getConfig(props.id);

    const [ zoomActive, setZoomActive ] = useState(false);
    const [ boxTransform, setBoxTransform ] = useState({ x: 0, y: 0 });

    const autoZoom = config.autoZoom || state.deviceType === DeviceTypes.MOBILE;

    const zoomMode = autoZoom ? 'auto' : 'manual';
    const zoomFactor = config.zoomFactor[zoomMode];
    const zoomTime = config.zoomTime[zoomMode];

    const growZoomBg = useCallback(() => setZoomActive(true), []);
    const shrinkZoomBg = useCallback(() => setZoomActive(false), []);

    const calculateBoxTransform = useCallback(
        event => {
            const xFromCenter = event.clientX - (state.viewportWidth / 2);
            const yFromCenter = event.clientY - (state.viewportHeight / 2);
            setBoxTransform({
                x: xFromCenter / (state.viewportWidth / 2) * zoomFactor / 2,
                y: yFromCenter / (state.viewportHeight / 2) * zoomFactor / 2
            });
        },
        [ state.viewportWidth, state.viewportHeight, zoomFactor ]
    );

    useEffect(() => {
        if (state.loading) {
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
    }, [ growZoomBg, shrinkZoomBg, calculateBoxTransform, state.loading, autoZoom ]);

    return (
        <div
            className={styles.background}
            style={{
                width: `${state.viewportWidth}px`,
                height: `${state.viewportHeight}px`,
                ...(config.css || {})
            }}
        >
            <div
                className={styles.zoomBox}
                style={{
                    width: zoomActive || autoZoom ? '100%' : '0',
                    height: zoomActive || autoZoom ? '100%' : '0',
                    transform: `translate(-${50 + boxTransform.x}%, -${50 + boxTransform.y}%)`,
                    transition: `width ${zoomTime}s ease-out, height ${zoomTime}s ease-out`
                }}
            >
                <Image
                    className={styles.image}
                    style={{
                        transform: `scale(${zoomActive ? (1 + zoomFactor / 100) : 1})`,
                        transition: `transform ${zoomTime}s ease-out`
                    }}
                    source={config.image}
                    width={state.viewportWidth}
                    height={state.viewportHeight}
                />
            </div>
        </div>
    );
}