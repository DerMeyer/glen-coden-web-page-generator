import React, { useContext } from 'react';
import Store from '../../../js/Store';
import { configService } from '../../../index';
import { DeviceTypes, OrientationTypes, getSizeFactor } from '../../../js/helpers';

import ItemBar from '../../partials/ItemBar/ItemBar';
import Link from '../../partials/Link/Link';
import Svg from '../../partials/Svg/Svg';
import Image from '../../partials/Image/Image';


export default function IconNavigation(props) {
    const { state } = useContext(Store);
    const config = configService.getConfig(props.id);

    const isPortrait = state.deviceType === DeviceTypes.MOBILE && state.orientationType === OrientationTypes.PORTRAIT;

    const width = config.fontSizes.body * 2.5 * getSizeFactor(state, config);
    const color = config.colors[config.color];

    return (
        <ItemBar
            stretchFactor={config.stretch}
            vertical={props.verticalOnPortrait && isPortrait}
            style={{ ...(config.css || {}) }}
        >
            {config.items.map(item => (
                <Link
                    key={`${item.targetUrl}-${item.svgName}-${item.imageUrl}`}
                    url={item.targetUrl}
                    internal={item.internal}
                >
                    {item.svgName && (
                        <Svg
                            name={item.svgName}
                            width={width}
                            color={color}
                        />
                    )}
                    {item.imageUrl && (
                        <Image
                            width={width}
                            height={width}
                            source={item.imageUrl}
                            doNotSubscribeToGlobalLoading
                        />
                    )}
                </Link>
            ))}
        </ItemBar>
    );
}