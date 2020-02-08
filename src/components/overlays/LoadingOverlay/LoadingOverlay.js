import React, { useContext, useState } from 'react';
import styles from './LoadingOverlay.module.css';
import Store from '../../../Store';
import { projectConfig, getComponentConfig } from '../../../index';

import ThreeDotsLoadingIcon from './ThreeDotsLoadingIcon/ThreeDotsLoadingIcon';


export default function LoadingOverlay(props) {
    const { globalState } = useContext(Store);
    const config = getComponentConfig(props.chain, 'LoadingOverlay');

    const [visible, setVisible] = useState(true);

    if (!visible) {
        if (globalState.loading) {
            setVisible(true);
        }
        return null;
    }

    return (
        <div
            className={styles.overlay}
            style={{
                backgroundColor: config.style.overlayColor,
                opacity: globalState.loading ? '1' : '0',
                transition: `opacity ${globalState.loading ? 0 : projectConfig.fadeInTime}s`
            }}
            onTransitionEnd={() => setVisible(false)}
        >
            {globalState.loading ? <ThreeDotsLoadingIcon size={Math.round(globalState.viewportWidth / 15)} /> : null}
        </div>
    );
}