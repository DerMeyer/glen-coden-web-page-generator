import React, { useContext, useEffect, useState } from 'react';
import s from './Page.module.css';
import Store from '../../../store/Store';

Page.defaultProps = {
    contentSize: {
        width: 0.8,
        height: 0.9
    },
    pageWidth: 1,
    maxContentWidth: 2500
};


export default function Page({ contentSize, maxContentWidth, pageWidth, maxPageWidth, rows, minHeight, bgColor, css, children }) {
    const { state } = useContext(Store);
    const { vw, vh } = state;
    const { width, height } = contentSize;

    const [ style, setStyle ] = useState({});

    useEffect(() => {
        const w = pageWidth * vw;
        const h = height * vh;
        const contentWidth = width * vw;

        const r = {};

        if (maxPageWidth && w > maxPageWidth) {
            r.width = `${maxPageWidth}px`;
            r.margin = `0 ${(vw - maxPageWidth) / 2}px`;
        } else {
            r.width = `${w}px`;
            if (w !== vw) {
                r.margin = `0 ${(vw - w) / 2}px`;
            }
        }

        r.padding = `${(vh - h) / 2}px ${((w - contentWidth) / 2) + (Math.max((contentWidth - maxContentWidth), 0) / 2)}px`;

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
    }, [ width, height, vw, vh, maxContentWidth, pageWidth, maxPageWidth, rows, minHeight, bgColor, css ]);

    return (
        <section
            className={s.page}
            style={style}
        >
            {children}
        </section>
    );
}