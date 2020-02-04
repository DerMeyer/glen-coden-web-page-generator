import React from 'react';
import styles from './ThreeDotsLoadingIcon.module.css';
import { projectConfig} from '../../../../index';

const defaultSize = 100;


export default function ThreeDotsLoadingIcon(props) {
    const size = Math.round(props.size || defaultSize);
    console.log(size);// TODO remove dev code
    return (
        <div
            className={styles.iconBox}
            style={{ width: `${size}px`, height: `${size}px` }}
        >
            <div className={`${styles.dot} ${styles.dotOne}`} style={{ backgroundColor: projectConfig.style.darkFontColor }} />
            <div className={`${styles.dot} ${styles.dotTwo}`} style={{ backgroundColor: projectConfig.style.darkFontColor }} />
            <div className={`${styles.dot} ${styles.dotThree}`} style={{ backgroundColor: projectConfig.style.darkFontColor }} />
        </div>
    );
}