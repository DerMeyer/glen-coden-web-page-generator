import React, { useContext, useState } from 'react';
import styles from './LoadingOverlay.module.css';
import Store from '../../../js/Store';
import { configService } from '../../../index';

import ThreeDotsLoadingIcon from './ThreeDotsLoadingIcon/ThreeDotsLoadingIcon';


export default function LoadingOverlay(props) {
    const { globalState } = useContext(Store);

    const [projectConfig] = useState(() => configService.getProjectConfig());
    const [config] = useState(() => configService.getComponentConfig(props.id));
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
                backgroundColor: config.style.colors.overlay,
                opacity: globalState.loading ? '1' : '0',
                transition: `opacity ${globalState.loading ? 0 : projectConfig.fadeInTime}s`
            }}
            onTransitionEnd={() => setVisible(false)}
        >
            {globalState.loading ? <ThreeDotsLoadingIcon size={Math.round(globalState.viewportWidth / 15)} /> : null}
        </div>
    );
}