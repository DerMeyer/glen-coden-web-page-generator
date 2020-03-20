import React, { useContext, useState } from 'react';
import styles from './Page.module.css';
import Store from '../../../js/Store';
import { configService } from '../../../index';


export default function Page(props) {
    const { globalState } = useContext(Store);
    const [config] = useState(() => configService.getComponentConfig(props.id));

    const style = {
        left: `${Math.max((globalState.viewportWidth - config.style.maxPageWidth), 0) / 2}px`,
        width: `${Math.min(globalState.viewportWidth, config.style.maxPageWidth)}px`,
        minHeight: `${globalState.viewportHeight}px`
    };

    if (config.overflowHidden) {
        style.overflowY = 'hidden';
    }

    return (
        <div
            className={styles.page}
            style={style}
        >
            {props.children}
        </div>
    );
}