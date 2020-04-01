import React, { useContext, useState, useRef, useEffect } from 'react';
import Store from '../../../js/Store';
import { configService } from '../../../index';
import { DeviceTypes, OrientationTypes, i18n } from '../../../js/helpers';


export default function Headline(props) {
    const { globalState } = useContext(Store);
    const [config] = useState(() => configService.getComponentConfig(props.id));

    const ref = useRef(null);

    const [element, setElement] = useState('h1');
    const [style, setStyle] = useState({});

    useEffect(() => {
        switch (config.size) {
            case 'big':
                setElement('h1');
                break;
            case 'medium':
                setElement('h2');
                break;
            case 'small':
                setElement('h3');
                break;
            default:
        }
    }, [config.size]);

    useEffect(() => {
        const sizeFactor = globalState.deviceType === DeviceTypes.MOBILE
            ? (globalState.orientationType === OrientationTypes.PORTRAIT ? config.mobileSizeBy.portrait : config.mobileSizeBy.landscape)
            : 1;
        setStyle({
            margin: 0,
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            fontSize: config.style.fontSizes[element] * sizeFactor,
            fontFamily: config.style.fontTypes[config.fontTypeIndex] || config.style.fontTypes[0],
            color: config.style.colors[config.color]
        });
    }, [config, globalState.deviceType, globalState.orientationType, element]);

    const text = i18n(config.text);

    return React.createElement(element, { ref, style }, [ text ]);
}