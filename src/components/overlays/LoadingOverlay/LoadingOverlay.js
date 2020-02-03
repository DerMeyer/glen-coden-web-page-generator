import React, { useContext, useState } from 'react';
import styles from './LoadingOverlay.module.css';
import Store from '../../../Store';


export default function LoadingOverlay() {
    const { globalState } = useContext(Store);
    const [visible, setVisible] = useState(globalState.loading);

    return (
        <div
            className={styles.overlay}
        >
            Loading
        </div>
    );
}