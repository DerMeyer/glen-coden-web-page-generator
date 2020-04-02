import React, { useState, useContext, useEffect, useCallback } from 'react';
import styles from './Row.module.css';
import Store from '../../../js/Store';
import { configService } from '../../../index';


export default function Row(props) {
    const { state } = useContext(Store);
    const [ config ] = useState(() => configService.getComponentConfig(props.id));
    const [ style, setStyle ] = useState({});

    const getStyle = useCallback(
        (contentWidth, viewportWidth) => {
            const { alignSelf, justifyContent, alignItems } = config;
            return {
                width: `${contentWidth / 100 * viewportWidth}px`,
                alignSelf,
                justifyContent,
                alignItems
            };
        },
        [ config ]
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
                ...(config.css || {})
            }}
        >
            {props.children}
        </div>
    );
}