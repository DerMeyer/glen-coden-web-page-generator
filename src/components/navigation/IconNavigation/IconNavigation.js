import React, { useContext } from 'react';
import Store from '../../../store/Store';
import { DeviceTypes, OrientationTypes, getSizeFactor } from '../../../js/helpers';

import ItemBar from '../../partial/ItemBar/ItemBar';
import Link from '../../rebox/Link/Link';
import Svg from '../../rebox/Svg/Svg';
import Image from '../../rebox/Image/Image';

IconNavigation.defaultProps = {
    rows: 3,
    minHeight: 0,
    css: {},
    global: {}
};


export default function IconNavigation({ color, stretch, verticalOnPortrait, items, sizing, css, global }) {
    const { state } = useContext(Store);

    const isPortrait = state.deviceType === DeviceTypes.MOBILE && state.orientationType === OrientationTypes.PORTRAIT;

    const { fontSizes, colors } = global;
    const width = fontSizes.body * 2.5 * getSizeFactor(state, sizing);
    const svgColor = colors[color];

    return (
        <ItemBar
            stretchFactor={stretch}
            vertical={verticalOnPortrait && isPortrait}
            style={{ ...css }}
        >
            {items.map(item => (
                <Link
                    key={`${item.targetUrl}-${item.svgName}-${item.imageUrl}`}
                    url={item.targetUrl}
                    internal={item.internal}
                >
                    {item.svgName && (
                        <Svg
                            name={item.svgName}
                            width={width}
                            color={svgColor}
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