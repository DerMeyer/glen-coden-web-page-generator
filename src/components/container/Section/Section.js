import React, { useState, useContext, useEffect, useCallback } from 'react';
import styles from './Section.module.css';
import Store from '../../../js/Store';
import { configService } from '../../../index';
import { getContentSize } from '../../../js/helpers';


export default function Section(props) {
    const { globalState } = useContext(Store);
    const [config] = useState(() => configService.getComponentConfig(props.id));

    const [contentSize, setContentSize] = useState({});

    useEffect(() => {
        const size = getContentSize(globalState.deviceType, config);
        setContentSize(size);
    }, [globalState.deviceType, config]);

    const [style, setStyle] = useState({});

    const getStyle = useCallback(
        contentSize => {
            const style = {
                left: '50%',
                transform: 'translateX(-50%)',
                width: `${contentSize.width}%`,
                justifyContent: config.justifyContent,
                alignItems: config.alignItems
            };
            switch (config.verticalPosition) {
                case 'top':
                    style.top = `${(100 - contentSize.height) / 2 + config.addTopOffset}%`;
                    break;
                case 'center':
                    style.top = `${50 + config.addTopOffset}%`;
                    style.transform = 'translate(-50%, -50%)';
                    break;
                case 'bottom':
                    style.bottom = `${(100 - contentSize.height) / 2 - config.addTopOffset}%`;
                    break;
                default:
            }
            return style;
        },
        [config]
    );

    useEffect(() => {
        const updatedStyle = getStyle(contentSize);
        setStyle(updatedStyle);
    }, [getStyle, contentSize]);

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