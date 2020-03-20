import React, { useContext, useState, useRef, useEffect } from 'react';
import Store from '../../../js/Store';
import { configService } from '../../../index';
import { i18n } from '../../../js/helpers';


export default function Headline(props) {
    const { globalState } = useContext(Store);
    const [config] = useState(() => configService.getComponentConfig(props.id));

    const ref = useRef(null);

    const [style, setStyle] = useState({});
    const [scale, setScale] = useState(1);

    let element;
    switch (config.size) {
        case 'big':
            element = 'h1';
            break;
        case 'medium':
            element = 'h2';
            break;
        case 'small':
            element = 'h3';
            break;
        default:
    }

    useEffect(() => {
        setStyle({
            margin: 0,
            fontSize: config.style.fontSizes[element],
            fontFamily: config.style.fontTypes[config.fontType] || config.style.fontTypes[0],
            fontWeight: 'bold',
            color: config.style[config.color],
            whiteSpace: 'nowrap',
            transform: `scale(${scale}) translateX(-${(100 - scale * 100) / 2 / scale}%)`
        });
    }, [config, element, scale]);

    useEffect(() => {
        const sizeFactor = (globalState.viewportWidth * globalState.contentWidth / 100) / ref.current.offsetWidth;
        if (sizeFactor < 1) {
            setScale(sizeFactor);
            return;
        }
        setScale(1);
    }, [globalState.viewportWidth, globalState.contentWidth]);

    const text = i18n(config.text);

    return React.createElement(element, { ref, style }, [ text ]);
}