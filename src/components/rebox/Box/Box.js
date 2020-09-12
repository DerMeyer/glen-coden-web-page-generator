import React, { useState, useEffect } from 'react';
import s from './Box.module.css';


export default function Box({ p, px, py, m, mx, my, fontSize, width, color, bg, css, children }) {
    const [ style, setStyle ] = useState({});

    useEffect(() => {
        const r = {};

        if (typeof p !== 'undefined') {
            r.padding = p;
        }
        if (typeof px !== 'undefined') {
            r.padding = `0 ${p}`;
        }
        if (typeof py !== 'undefined') {
            r.padding = `${p} 0`;
        }
        if (typeof m !== 'undefined') {
            r.padding = m;
        }
        if (typeof mx !== 'undefined') {
            r.padding = `0 ${m}`;
        }
        if (typeof my !== 'undefined') {
            r.padding = `${m} 0`;
        }
        if (typeof fontSize !== 'undefined') {
            r.fontSize = fontSize;
        }
        if (typeof width !== 'undefined') {
            r.width = `${width * 100}%`;
        }
        if (typeof color !== 'undefined') {
            r.color = color;
        }
        if (typeof bg !== 'undefined') {
            r.backgroundColor = bg;
        }
        if (css) {
            setStyle({ ...r, ...css });
            return;
        }
        setStyle(r);
    }, [ p, px, py, m, mx, my, fontSize, width, color, bg, css ]);

    return (
        <div
            className={s.box}
            style={style}
        >
            {children}
        </div>
    );
}