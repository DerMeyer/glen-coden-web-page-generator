import React, { useContext, useState, useCallback, useEffect } from 'react';
import styles from './StickyBar.module.css';
import Store from '../../../js/Store';
import { configService } from '../../../index';
import { getContentSize } from '../../../js/helpers';


export default function StickyBar(props) {
    const { globalState } = useContext(Store);
    const [config] = useState(() => configService.getComponentConfig(props.id));

    const [contentSize, setContentSize] = useState({});

    useEffect(() => {
        const size = getContentSize(globalState.deviceType, config);
        setContentSize(size);
    }, [globalState.deviceType, config]);

    const [doStick, setDoStick] = useState(false);

    const checkScroll = useCallback(
        () => {
            if (window.scrollY > globalState.viewportHeight / 10) {
                setDoStick(true);
                return;
            }
            setDoStick(false);
        },
        [globalState.viewportHeight]
    );

    useEffect(() => {
        window.addEventListener('scroll', checkScroll);
        return () => {
            window.removeEventListener('scroll', checkScroll);
        };
    }, [checkScroll]);

    const style = {
        top: doStick ? '0' : `${(100 - contentSize.height) / 2}%`,
        width: `${contentSize.width}%`,
        padding: doStick ? `0 ${(100 - contentSize.width) / 2}%` : '0',
        transition: `top ${config.transitionTime}s, padding ${config.transitionTime}s`,
        justifyContent: config.justifyContent,
        alignItems: config.alignItems,
        backgroundColor: config.style.overlayColor
    };

    return (
        <div
            className={styles.stickyBar}
            style={{
                ...style,
                ...config.css
            }}
        >
            {props.children}
        </div>
    );
}