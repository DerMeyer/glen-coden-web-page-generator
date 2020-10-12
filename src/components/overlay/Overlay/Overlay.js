import React, { useState, useEffect } from 'react';
import s from './Overlay.module.css';


export default function Overlay({ color = '#000', opacity = 1, fadeTime = 0.2, onFadeOut = () => {}, doClose = false, initVisible = false, children }) {
    const [ visible, setVisible ] = useState(initVisible);

    useEffect(() => {
        if (doClose) {
            setVisible(false);
            return;
        }
        window.setTimeout(() => setVisible(true), 20);
    }, [ doClose ]);

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
                onFadeOut();
            }}
        >
            {children}
        </div>
    );
}