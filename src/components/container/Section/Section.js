import React, { useState, useContext, useEffect, useCallback } from 'react';
import styles from './Section.module.css';
import Store from '../../../js/Store';
import { configService } from '../../../index';


export default function Section(props) {
    const { state } = useContext(Store);
    const [config] = useState(() => configService.getComponentConfig(props.id));

    const [style, setStyle] = useState({});

    const getStyle = useCallback(
        (contentWidth, contentHeight) => {
            const style = {
                left: '50%',
                transform: 'translateX(-50%)',
                width: `${contentWidth}%`,
                justifyContent: config.justifyContent,
                alignItems: config.alignItems
            };
            switch (config.verticalPosition) {
                case 'top':
                    style.top = `${(100 - contentHeight) / 2 + config.addTopOffset}%`;
                    break;
                case 'center':
                    style.top = `${50 + config.addTopOffset}%`;
                    style.transform = 'translate(-50%, -50%)';
                    break;
                case 'bottom':
                    style.bottom = `${(100 - contentHeight) / 2 - config.addTopOffset}%`;
                    break;
                default:
            }
            return style;
        },
        [config]
    );

    useEffect(() => {
        const updatedStyle = getStyle(state.contentWidth, state.contentHeight);
        setStyle(updatedStyle);
    }, [getStyle, state.contentWidth, state.contentHeight]);

    return (
        <div
            className={styles.section}
            style={{
                ...style,
                ...config.css
            }}
        >
            {props.children}
        </div>
    );
}