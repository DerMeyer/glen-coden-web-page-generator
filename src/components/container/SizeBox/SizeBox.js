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


export default function SizeBox({ width, height, center, children }) {
    const [ returnWidth, getReturnWidth ] = useSize(width);
    const [ returnHeight, getReturnHeight ] = useSize(height);

    const [ style, setStyle ] = useState(calcStyle(returnWidth, returnHeight, center));

    useEffect(() => {
        getReturnWidth(width);
        getReturnHeight(height);
    }, [ getReturnWidth, getReturnHeight, width, height ]);

    useEffect(() => {
        setStyle(calcStyle(returnWidth, returnHeight, center));
    },[ returnWidth, returnHeight, center ]);

    return (
        <div style={style}>
            {children}
        </div>
    );
}