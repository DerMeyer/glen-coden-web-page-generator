import React from 'react';
import styles from './ThreeDotsLoadingIcon.module.css';
import PropTypes from 'prop-types';
import { configService } from '../../../../index';

ThreeDotsLoadingIcon.propTypes = {
    size: PropTypes.number.isRequired
};


export default function ThreeDotsLoadingIcon(props) {
    const config = configService.getConfig();
    return (
        <div
            className={styles.iconBox}
            style={{ width: `${props.size}px`, height: `${props.size}px` }}
        >
            <div className={`${styles.dot} ${styles.dotOne}`} style={{ backgroundColor: config.colors.dark }}/>
            <div className={`${styles.dot} ${styles.dotTwo}`} style={{ backgroundColor: config.colors.dark }}/>
            <div className={`${styles.dot} ${styles.dotThree}`} style={{ backgroundColor: config.colors.dark }}/>
        </div>
    );
}