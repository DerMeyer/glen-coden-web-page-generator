import React, { useContext, useState } from 'react';
import Store from '../../../js/Store';
import { configService } from '../../../index';
import { DeviceTypes, OrientationTypes } from '../../../js/helpers';

import ItemBar from '../../../partials/ItemBar/ItemBar';
import Link from '../../../partials/Link/Link';
import Svg from '../../../partials/Svg/Svg';


export default function IconNavigation(props) {
    const { globalState } = useContext(Store);
    const [config] = useState(() => configService.getComponentConfig(props.id));

    const navigationBarVertical = globalState.deviceType === DeviceTypes.MOBILE && globalState.orientationType === OrientationTypes.PORTRAIT;

    return (
        <ItemBar
            stretchFactor={config.stretch}
            vertical={navigationBarVertical}
        >
            {config.icons.map(icon => (
                <Link
                    key={`${icon.url}-${icon.svg}`}
                    url={icon.url}
                    internal={icon.internal}
                >
                    <Svg
                        name={icon.svg}
                        width={config.style.fontSizes.body * 2.5 * config.size}
                        color={config.style[config.color]}
                    />
                </Link>
            ))}
        </ItemBar>
    );
}