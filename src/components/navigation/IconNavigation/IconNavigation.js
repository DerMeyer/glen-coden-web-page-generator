import React, { useContext, useState } from 'react';
import styles from './IconNavigation.module.css';
import Store from '../../../js/Store';
import { configService } from '../../../index';
import { DeviceTypes, OrientationTypes } from '../../../js/helpers';

import NavigationBar from '../../../partials/NavigationBar/NavigationBar';
import Link from '../../../partials/Link/Link';
import Svg from '../../../partials/Svg/Svg';


export default function IconNavigation(props) {
    const { globalState } = useContext(Store);
    const [config] = useState(() => configService.getComponentConfig(props.id));

    const navigationBarVertical = globalState.deviceType === DeviceTypes.MOBILE && globalState.orientationType === OrientationTypes.PORTRAIT;

    return (
        <NavigationBar
            className={navigationBarVertical ? styles.navigationBarVertical : ''}
        >
            {config.icons.map(icon => (
                <Link
                    key={`${icon.url}-${icon.svg}`}
                    url={icon.url}
                    internal={icon.internal}
                >
                    <Svg name={icon.svg} width={40} color={config.style.lightFontColor} />
                </Link>
            ))}
        </NavigationBar>
    );
}