import React, { useContext, useState, useCallback, useEffect } from 'react';
import styles from './StickyBar.module.css';
import Store from '../../../js/Store';
import { configService } from '../../../index';


export default function StickyBar(props) {
    const { globalState } = useContext(Store);
    const [config] = useState(() => configService.getComponentConfig(props.id));

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
        top: doStick ? '0' : `${(100 - globalState.contentHeight) / 2}%`,
        width: `${globalState.contentWidth}%`,
        padding: doStick ? `0 ${(100 - globalState.contentWidth) / 2}%` : '0',
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