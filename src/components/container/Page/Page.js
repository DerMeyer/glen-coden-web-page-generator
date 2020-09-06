import React, { useCallback, useContext, useEffect, useState } from 'react';
import s from './Page.module.css';
import Store from '../../../store/Store';

Page.defaultProps = {
    rows: 3,
    minHeight: 0,
    css: {},
    global: {}
};


export default function Page({ rows, minHeight, global, color, css, children }) {
    const { state } = useContext(Store);

    const [ style, setStyle ] = useState({});

    const getStyle = useCallback(
        (contentWidth, contentHeight, vw, vh) => {
            const contWidth = contentWidth / 100 * vw;
            const contHeight = contentHeight / 100 * vh;
            const result = {
                gridTemplateRows: `repeat(${rows}, minmax(${contHeight / rows}px, auto))`,
                width: `${vw}px`,
                minHeight: `${minHeight || vh}px`,
                padding: `${(vh - contHeight) / 2}px ${((vw - contWidth) / 2) + (Math.max((vw - global.maxPageWidth), 0) / 2)}px`,
            };
            if (global.colors) {
                result.backgroundColor = global.colors[color];
            }
            return result;
        },
        [ rows, minHeight, global, color ]
    );

    useEffect(() => {
        const updatedStyle = getStyle(state.contentWidth, state.contentHeight, state.vw, state.vh);
        setStyle(updatedStyle);
    }, [ getStyle, state.contentWidth, state.contentHeight, state.vw, state.vh ]);

    return (
        <div
            className={s.page}
            style={{
                ...style,
                ...css
            }}
        >
            {children}
        </div>
    );
}