import React, { useContext, useState } from 'react';
import styles from './Page.module.css';
import Store from '../../../js/Store';
import { configService } from '../../../index';


export default function Page(props) {
    const { globalState } = useContext(Store);
    const [config] = useState(() => configService.getComponentConfig(props.id));
    return (
        <div
            className={styles.page}
            style={{
                width: `${globalState.viewportWidth}px`,
                minHeight: `${globalState.viewportHeight}px`,
                overflow: config.overflowHidden ? 'hidden' : 'auto'
            }}
        >
            {props.children}
        </div>
    );
}