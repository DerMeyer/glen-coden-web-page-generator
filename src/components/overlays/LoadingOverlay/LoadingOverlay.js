import React, { useContext, useState } from 'react';
import styles from './LoadingOverlay.module.css';
import Store from '../../../Store';
import { projectConfig } from '../../../index';


export default function LoadingOverlay() {
    const { globalState } = useContext(Store);
    const config = projectConfig.components.LoadingOverlay;

    const [visible, setVisible] = useState(globalState.loading);

    if (globalState.loading === 0) {
        return null;
    }

    return (
        <div
            className={styles.overlay}
            style={{
                backgroundColor: config.style.overlayColor
            }}
        >
            Loading
        </div>
    );
}