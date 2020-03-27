import React, { useState, useRef, useEffect } from 'react';
import { configService } from '../../../index';
import { i18n } from '../../../js/helpers';


export default function Headline(props) {
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
        setStyle({
            margin: 0,
            fontWeight: 'bold',
            fontSize: config.style.fontSizes[element],
            fontFamily: config.style.fontTypes[config.fontTypeIndex] || config.style.fontTypes[0],
            color: config.style.colors[config.color]
        });
    }, [config, element]);

    const text = i18n(config.text);

    return React.createElement(element, { ref, style }, [ text ]);
}