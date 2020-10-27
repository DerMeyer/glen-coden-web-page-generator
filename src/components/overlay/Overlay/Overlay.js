import React, { useState, useEffect } from 'react';
import s from './Overlay.module.css';


export default function Overlay({ color = '#000', opacity = 1, fadeTime = 0.2, onFadeOut = () => {}, doClose = false, initVisible = false, children }) {
    const [ visible, setVisible ] = useState(initVisible);
    const [ safetyTimeoutId, setSafetyTimeoutId ] = useState(0);

    useEffect(() => {
        if (doClose && !safetyTimeoutId) {
            setVisible(false);
            setSafetyTimeoutId(window.setTimeout(() => {
                onFadeOut();
            }, (fadeTime + 0.1) * 1000))
            return () => {
                window.clearTimeout(safetyTimeoutId);
            };
        }
        if (!doClose && safetyTimeoutId) {
            setSafetyTimeoutId(0);
        }
        if (!safetyTimeoutId) {
            setVisible(true);
        }
    }, [ fadeTime, onFadeOut, doClose, safetyTimeoutId ]);

    return (
        <div
            className={s.Overlay}
            style={{
                backgroundColor: color,
                opacity: visible ? opacity : 0,
                transition: `opacity ${fadeTime}s`
            }}
            onClick={() => setVisible(false)}
            onTransitionEnd={() => {
                if (visible) {
                    return;
                }
                window.clearTimeout(safetyTimeoutId);
                onFadeOut();
            }}
        >
            {children}
        </div>
    );
}