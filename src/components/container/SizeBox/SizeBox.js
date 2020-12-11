import React, { useState, useEffect } from 'react';
import useSize from '../../../hooks/useSize';

function calcStyle(width, height, center) {
    const style = {};

    if (width) {
        style.width = `${width}px`;
    }
    if (height) {
        style.height = `${height}px`;
    }
    if (center) {
        style.position = 'relative';
        style.left = '50%';
        style.transform = 'translateX(-50%)';
    }

    return style;
}


export default function SizeBox({ width: w, height: h, center, children }) {
    const [ width, getWidth ] = useSize(w);
    const [ height, getHeight ] = useSize(h);

    const [ style, setStyle ] = useState(() => calcStyle(width, height, center));

    useEffect(() => {
        getWidth(w);
        getHeight(h);
    }, [ getWidth, getHeight, w, h ]);

    useEffect(() => {
        setStyle(calcStyle(width, height, center));
    },[ width, height, center ]);

    return (
        <div style={style}>
            {children}
        </div>
    );
}