import React, { useContext, useState } from 'react';
import styles from './LoadingOverlay.module.css';
import Store from '../../../js/Store';
import { configService } from '../../../index';

import ThreeDotsLoadingIcon from '../../partials/icons/ThreeDotsLoadingIcon/ThreeDotsLoadingIcon';


export default function LoadingOverlay(props) {
    const { state } = useContext(Store);
    const config = configService.getConfig(props.id);

    const [ visible, setVisible ] = useState(true);

    if (!visible) {
        if (state.loading.length) {
            setVisible(true);
        }
        return null;
    }

    return (
        <div
            className={styles.overlay}
            style={{
                backgroundColor: config.colors.overlay,
                opacity: state.loading.length ? '1' : '0',
                transition: `opacity ${state.loading.length ? 0 : config.fadeInTime}s`,
                ...(config.css || {})
            }}
            onTransitionEnd={() => setVisible(false)}
        >
            {state.loading.length ? <ThreeDotsLoadingIcon size={Math.round(state.viewportWidth / 15)}/> : null}
        </div>
    );
}