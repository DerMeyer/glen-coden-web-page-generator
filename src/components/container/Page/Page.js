import React, { useContext, useEffect, useState } from 'react';
import s from './Page.module.css';
import Store from '../../../store/Store';

Page.defaultProps = {
    pageSize: {
        width: 80,
        height: 90
    },
    maxPageWidth: 2500
};


export default function Page({ pageSize, maxPageWidth, rows, minHeight, bgColor, css, children }) {
    const { state } = useContext(Store);
    const { vw, vh } = state;
    const { width, height } = pageSize;

    const [ style, setStyle ] = useState({});

    useEffect(() => {
        const w = width / 100 * vw;
        const h = height / 100 * vh;

        const r = {
            width: `${w}px`,
            padding: `${(vh - h) / 2}px 0`,
            margin: `0 ${((vw - w) / 2) + (Math.max((vw - maxPageWidth), 0) / 2)}px`
        };

        if (rows) {
            r.display = 'grid';
            r.gridTemplateRows = `repeat(${rows}, minmax(${h / rows}px, auto))`;
        }

        if (minHeight) {
            if (minHeight === 'viewport') {
                r.minHeight = `${vh}px`;
            } else {
                r.minHeight = `${minHeight}px`;
            }
        }

        if (bgColor) {
            r.backgroundColor = bgColor;
        }

        if (css) {
            setStyle({ ...r, ...css });
            return;
        }
        setStyle(r);
    }, [ width, height, vw, vh, maxPageWidth, rows, minHeight, bgColor, css ]);

    return (
        <div
            className={s.page}
            style={style}
        >
            {children}
        </div>
    );
}