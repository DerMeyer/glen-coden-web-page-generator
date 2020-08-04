import React, { useState, useContext, useEffect, useCallback } from 'react';
import styles from './Row.module.css';
import Store from '../../../store/Store';

Row.defaultProps = {
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    css: {}
};


export default function Row({ alignSelf, justifyContent, alignItems, css, children }) {
    const { state } = useContext(Store);

    const [ style, setStyle ] = useState({});

    const getStyle = useCallback(
        (contentWidth, viewportWidth) => {
            return {
                width: `${contentWidth / 100 * viewportWidth}px`,
                alignSelf,
                justifyContent,
                alignItems
            };
        },
        [ alignSelf, justifyContent, alignItems ]
    );

    useEffect(() => {
        const updatedStyle = getStyle(state.contentWidth, state.viewportWidth);
        setStyle(updatedStyle);
    }, [ getStyle, state.contentWidth, state.viewportWidth ]);

    return (
        <div
            className={styles.row}
            style={{
                ...style,
                ...css
            }}
        >
            {children}
        </div>
    );
}