import React, { useRef, useState, useEffect } from 'react';
import s from './Page.module.css';
import { useSelector } from 'react-redux';
import { selectSize } from '../../../app/appSlice';
import { imageService } from '../../../index';
import { setBgStyle } from '../../../app/util';

import LoadingSign from '../../partial/LoadingSign/LoadingSign';

Page.defaultProps = {
    contentSize: {
        width: 0.8,
        height: 0.9
    },
    maxContentWidth: 1200,
    pageWidth: 1
};


export default function Page({ contentSize, maxContentWidth, pageWidth, maxPageWidth, minHeight, rows, columns, bg, fadeInTime, loadingIcon, css, children }) {
    const { vw, vh } = useSelector(selectSize);

    const pageRef = useRef(null);

    const [ loadComplete, setLoadComplete ] = useState(false);
    const [ style, setStyle ] = useState(fadeInTime ? { opacity: 0 } : {});

    useEffect(() => {
        const id = imageService.subscribePage(pageRef.current, () => setLoadComplete(true));
        return () => imageService.unsubscribePage(id);
    }, []);

    useEffect(() => {
        const fullWidth = pageWidth * vw;
        const contentWidth = contentSize.width * vw;
        const contentHeight = contentSize.height * vh;

        const r = {};

        if (maxPageWidth && fullWidth > maxPageWidth) {
            r.width = `${maxPageWidth}px`;
            r.margin = `0 ${(vw - maxPageWidth) / 2}px`;
        } else {
            r.width = `${fullWidth}px`;
            if (fullWidth !== vw) {
                r.margin = `0 ${(vw - fullWidth) / 2}px`;
            }
        }

        r.padding = `${(vh - contentHeight) / 2}px ${((fullWidth - contentWidth) / 2) + (Math.max((contentWidth - maxContentWidth), 0) / 2)}px`;

        if (typeof minHeight === 'number') {
            r.minHeight = `${minHeight}px`;
        } else if (typeof minHeight === 'string' && minHeight.endsWith('vh')) {
            r.minHeight = `${Math.round(Number(minHeight.slice(0, -2)) / 100 * vh)}px`;
        }

        if (rows || columns) {
            r.display = 'grid';
        }
        if (rows) {
            r.gridTemplateRows = `repeat(${rows}, minmax(${contentHeight / rows}px, auto))`;
        }
        if (columns) {
            r.gridTemplateColumns = `repeat(${columns}, minmax(${Math.min(contentWidth, maxContentWidth) / columns}px, auto))`;
        }

        setBgStyle(bg, r);

        if (fadeInTime) {
            r.opacity = loadComplete ? 1 : 0;
            r.transition = `opacity ${fadeInTime}s ease`;
        }

        if (css) {
            setStyle({ ...r, ...css });
            return;
        }
        setStyle(r);
    }, [ vw, vh, contentSize.width, contentSize.height, maxContentWidth, pageWidth, maxPageWidth, minHeight, rows, columns, bg, fadeInTime, css, loadComplete ]);

    return (
        <>
            <section
                ref={pageRef}
                className={s.Page}
                style={style}
            >
                {children}
            </section>
            <LoadingSign parentVisible={loadComplete} />
        </>
    );
}