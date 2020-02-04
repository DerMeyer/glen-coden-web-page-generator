import React from 'react';
import styles from './ThreeDotsLoadingIcon.module.css';

const size = 100;


export default function ThreeDotsLoadingIcon() {
    return (
        <div
            className={styles.iconBox}
            style={{ width: `${size}px`, height: `${size}px` }}
        >
            <div className={`${styles.dot} ${styles.dotOne}`} />
            <div className={`${styles.dot} ${styles.dotTwo}`} />
            <div className={`${styles.dot} ${styles.dotThree}`} />
        </div>
    );
}