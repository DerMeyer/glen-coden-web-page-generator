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
        (contentWidth, contentHeight, viewportWidth, viewportHeight) => {
            const contWidth = contentWidth / 100 * viewportWidth;
            const contHeight = contentHeight / 100 * viewportHeight;
            const result = {
                gridTemplateRows: `repeat(${rows}, minmax(${contHeight / rows}px, auto))`,
                width: `${viewportWidth}px`,
                minHeight: `${minHeight || viewportHeight}px`,
                padding: `${(viewportHeight - contHeight) / 2}px ${((viewportWidth - contWidth) / 2) + (Math.max((viewportWidth - global.maxPageWidth), 0) / 2)}px`,
            };
            if (global.colors) {
                result.backgroundColor = global.colors[color];
            }
            return result;
        },
        [ rows, minHeight, global, color ]
    );

    useEffect(() => {
        const updatedStyle = getStyle(state.contentWidth, state.contentHeight, state.viewportWidth, state.viewportHeight);
        setStyle(updatedStyle);
    }, [ getStyle, state.contentWidth, state.contentHeight, state.viewportWidth, state.viewportHeight ]);

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