import React, { useContext, useState } from 'react';
import styles from './Section.module.css';
import Store from '../../../js/Store';
import { configService } from '../../../index';
import { DeviceTypes } from '../../../js/helpers';


export default function Section(props) {
    const { globalState } = useContext(Store);
    const [config] = useState(() => configService.getComponentConfig(props.id));

    console.log(config);// TODO remove dev code

    const contentWidth = globalState.deviceType === DeviceTypes.MOBILE
        ? config.style.pageContentSize.widthMobile
        : config.style.pageContentSize.width;
    const contentHeight = globalState.deviceType === DeviceTypes.MOBILE
        ? config.style.pageContentSize.heightMobile
        : config.style.pageContentSize.height;

    const style = {
        left: '50%',
        width: `${contentWidth}%`,
        justifyContent: config.justifyContent,
        alignItems: config.alignItems
    };

    // TODO show possible inputs in schema
    switch (config.verticalPosition) {
        case 'top':
            style.top = `${(100 - contentHeight) / 2 + config.addTopOffset}%`;
            style.transform = 'translateX(-50%)';
            break;
        case 'center':
            style.top = `${50 + config.addTopOffset}%`;
            style.transform = 'translate(-50%, -50%)';
            break;
        case 'bottom':
            style.bottom = `${(100 - contentHeight) / 2 - config.addTopOffset}%`;
            style.transform = 'translateX(-50%)';
            break;
        default:
    }

    return (
        <div
            className={styles.section}
            style={style}
        >
            {props.children}
        </div>
    );
}