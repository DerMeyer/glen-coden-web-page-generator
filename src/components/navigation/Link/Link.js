import React, { useState } from 'react';
import styles from './Link.module.css';
import { configService } from '../../../index';
import Svg from '../../../partials/Svg/Svg';


export default function Link(props) {
    const [config] = useState(() => configService.getComponentConfig(props.id));
    return (
        <div
            className={styles.link}
        >
            <Svg
                name={config.icon}
                width={config.iconSize}
                color={config.style.lightFontColor}
            />
            {props.children}
        </div>
    );
}