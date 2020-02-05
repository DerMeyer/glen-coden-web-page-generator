import React, { useContext, useState } from 'react';
import styles from './LoadingOverlay.module.css';
import Store from '../../../Store';
import { projectConfig } from '../../../index';

import ThreeDotsLoadingIcon from './ThreeDotsLoadingIcon/ThreeDotsLoadingIcon';


export default function LoadingOverlay() {
    const { globalState } = useContext(Store);
    const config = projectConfig.components.LoadingOverlay;

    const [visible, setVisible] = useState(true);

    if (!visible) {
        if (globalState.loading) {
            setVisible(true);
        }
        return null;
    }

    const onTransitionEnd = () => {
        setVisible(false);
    };

    return (
        <div
            className={styles.overlay}
            style={{
                backgroundColor: config.style.overlayColor,
                opacity: globalState.loading ? '1' : '0',
                transition: `opacity ${globalState.loading ? 0 : projectConfig.global.fadeInTimeOnLoaded}s`
            }}
            onTransitionEnd={onTransitionEnd}
        >
            <ThreeDotsLoadingIcon size={globalState.viewportWidth / 15} />
        </div>
    );
}