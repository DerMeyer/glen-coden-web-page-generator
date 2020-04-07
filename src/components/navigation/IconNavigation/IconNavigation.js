import React, { useContext } from 'react';
import Store from '../../../js/Store';
import { configService } from '../../../index';
import { DeviceTypes, OrientationTypes, getSizeFactor } from '../../../js/helpers';

import ItemBar from '../../partials/ItemBar/ItemBar';
import Link from '../../partials/Link/Link';
import Svg from '../../partials/Svg/Svg';


export default function IconNavigation(props) {
    const { state } = useContext(Store);
    const config = configService.getConfig(props.id);

    const navigationBarVertical = state.deviceType === DeviceTypes.MOBILE && state.orientationType === OrientationTypes.PORTRAIT;

    return (
        <ItemBar
            stretchFactor={config.stretch}
            vertical={navigationBarVertical}
            style={{ ...(config.css || {}) }}
        >
            {config.icons.map(icon => (
                <Link
                    key={`${icon.url}-${icon.svg}`}
                    url={icon.url}
                    internal={icon.internal}
                >
                    <Svg
                        name={icon.svg}
                        width={config.fontSizes.body * 2.5 * getSizeFactor(state, config)}
                        color={config.colors[config.color]}
                    />
                </Link>
            ))}
        </ItemBar>
    );
}