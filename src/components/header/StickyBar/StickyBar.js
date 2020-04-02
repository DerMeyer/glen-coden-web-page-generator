import React, { useContext, useState, useCallback, useEffect } from 'react';
import styles from './StickyBar.module.css';
import Store from '../../../js/Store';
import { configService } from '../../../index';


export default function StickyBar(props) {
    const { state } = useContext(Store);
    const [ config ] = useState(() => configService.getComponentConfig(props.id));
    const [ doStick, setDoStick ] = useState(false);

    const checkScroll = useCallback(
        () => {
            if (window.scrollY > state.viewportHeight / 10) {
                setDoStick(true);
                return;
            }
            setDoStick(false);
        },
        [ state.viewportHeight ]
    );

    useEffect(() => {
        window.addEventListener('scroll', checkScroll);
        return () => {
            window.removeEventListener('scroll', checkScroll);
        };
    }, [ checkScroll ]);

    const style = {
        top: doStick ? '0' : `${(100 - state.contentHeight) / 2}%`,
        width: `${state.contentWidth}%`,
        padding: doStick ? `0 ${(100 - state.contentWidth) / 2}%` : '0',
        transition: `top ${config.transitionTime}s, padding ${config.transitionTime}s`,
        justifyContent: config.justifyContent,
        alignItems: config.alignItems,
        backgroundColor: config.style.colors.light
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