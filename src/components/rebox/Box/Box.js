import React, { useState, useEffect } from 'react';
import s from './Box.module.css';


export default function Box({ p, px, py, fontSize, width, color, bg, fontSizes, colors, css, children }) {
    const [ style, setStyle ] = useState({});

    useEffect(() => {
        const r = {};

        if (typeof p !== 'undefined') {
            r.padding = `${p}px`;
        }
        if (typeof px !== 'undefined') {
            r.padding = `0 ${p}px`;
        }
        if (typeof py !== 'undefined') {
            r.padding = `${p}px 0`;
        }
        if (typeof fontSize !== 'undefined') {
            r.fontSize = fontSizes[fontSize];
        }
        if (typeof width !== 'undefined') {
            r.width = `${width * 100}%`;
        }
        if (typeof color !== 'undefined') {
            r.color = colors[color];
        }
        if (typeof bg !== 'undefined') {
            r.backgroundColor = colors[bg];
        }
        if (css) {
            setStyle({ ...r, ...css });
            return;
        }
        setStyle(r);
    }, [ p, px, py, fontSize, width, color, bg, fontSizes, colors, css ]);

    return (
        <div
            className={s.box}
            style={style}
        >
            {children}
        </div>
    );
}