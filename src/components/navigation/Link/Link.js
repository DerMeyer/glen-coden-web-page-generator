import React, { useState } from 'react';
import styles from './Link.module.css';
import { configService } from '../../../index';


export default function Link(props) {
    const [config] = useState(() => configService.getComponentConfig(props.id));
    console.log(config);// TODO remove dev code
    return (
        <div
            className={styles.link}
        >
            Link
        </div>
    );
}