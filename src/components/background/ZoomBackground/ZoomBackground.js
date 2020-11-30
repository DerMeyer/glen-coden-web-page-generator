import React, { useContext, useState, useCallback, useEffect } from 'react';
import styles from './ZoomBackground.module.css';
import Store from '../../../store/Store';
import { DeviceTypes } from '../../../js/helpers';

import Image from '../../rebox/Image/Image';

ZoomBackground.defaultProps = {
    css: {},
    autoZoom: false,
    zoomFactor: {
        'manual': 4,
        'auto': 12
    },
    zoomTime: {
        'manual': 0.5,
        'auto': 10
    },
    image: 'images/background-image.jpg'
};


export default function ZoomBackground({ css, autoZoom, zoomFactor, zoomTime, image }) {
    const { state } = useContext(Store);

    const [ zoomActive, setZoomActive ] = useState(false);
    const [ boxTransform, setBoxTransform ] = useState({ x: 0, y: 0 });

    const auto = autoZoom || state.deviceType === DeviceTypes.MOBILE;

    const mode = auto ? 'auto' : 'manual';
    const factor = zoomFactor[mode];
    const time = zoomTime[mode];

    const growZoomBg = useCallback(() => setZoomActive(true), []);
    const shrinkZoomBg = useCallback(() => setZoomActive(false), []);

    const calculateBoxTransform = useCallback(
        event => {
            const xFromCenter = event.clientX - (state.vw / 2);
            const yFromCenter = event.clientY - (state.vh / 2);
            setBoxTransform({
                x: xFromCenter / (state.vw / 2) * factor / 2,
                y: yFromCenter / (state.vh / 2) * factor / 2
            });
        },
        [ state.vw, state.vh, factor ]
    );

    useEffect(() => {
        if (state.loading.length) {
            shrinkZoomBg();
            return;
        }
        if (auto) {
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
    }, [ growZoomBg, shrinkZoomBg, calculateBoxTransform, state.loading, auto ]);

    return (
        <div
            className={styles.background}
            style={{
                width: `${state.vw}px`,
                height: `${state.vh}px`,
                ...(css || {})
            }}
        >
            <div
                className={styles.zoomBox}
                style={{
                    width: zoomActive || auto ? '100%' : '0',
                    height: zoomActive || auto ? '100%' : '0',
                    transform: `translate(-${50 + boxTransform.x}%, -${50 + boxTransform.y}%)`,
                    transition: `width ${time}s ease-out, height ${time}s ease-out`
                }}
            >
                <Image
                    className={styles.image}
                    style={{
                        transform: `scale(${zoomActive ? (1 + factor / 100) : 1})`,
                        transition: `transform ${time}s ease-out`
                    }}
                    source={image}
                    width={state.vw}
                    height={state.vh}
                    subscribeToGlobalLoading
                />
            </div>
        </div>
    );
}