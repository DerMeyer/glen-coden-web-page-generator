import React, { useCallback, useContext, useEffect, useState } from 'react';
import styles from './Page.module.css';
import Store from '../../../store/Store';
import { configService } from '../../../index';


export default function Page(props) {
    const { state } = useContext(Store);
    const config = configService.getConfig(props.id);

    const [ style, setStyle ] = useState({});

    const getStyle = useCallback(
        (contentWidth, contentHeight, viewportWidth, viewportHeight) => {
            const contWidth = contentWidth / 100 * viewportWidth;
            const contHeight = contentHeight / 100 * viewportHeight;
            return {
                gridTemplateRows: `repeat(${config.rows}, minmax(${contHeight / config.rows}px, auto))`,
                width: `${viewportWidth}px`,
                minHeight: `${config.minHeight || viewportHeight}px`,
                padding: `${(viewportHeight - contHeight) / 2}px ${((viewportWidth - contWidth) / 2) + (Math.max((viewportWidth - config.maxPageWidth), 0) / 2)}px`,
                backgroundColor: config.colors[config.color]
            };
        },
        [ config ]
    );

    useEffect(() => {
        const updatedStyle = getStyle(state.contentWidth, state.contentHeight, state.viewportWidth, state.viewportHeight);
        setStyle(updatedStyle);
    }, [ getStyle, state.contentWidth, state.contentHeight, state.viewportWidth, state.viewportHeight ]);

    return (
        <div
            className={styles.page}
            style={{
                ...style,
                ...(config.css || {})
            }}
        >
            {props.children}
        </div>
    );
}