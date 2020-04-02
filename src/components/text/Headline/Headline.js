import React, { useContext, useState, useEffect } from 'react';
import Store from '../../../js/Store';
import { configService } from '../../../index';
import { getSizeFactor, i18n } from '../../../js/helpers';


export default function Headline(props) {
    const { state } = useContext(Store);
    const [ config ] = useState(() => configService.getComponentConfig(props.id));
    const [ element, setElement ] = useState('h1');
    const [ style, setStyle ] = useState({});

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
    }, [ config.size ]);

    useEffect(() => {
        setStyle({
            margin: 0,
            fontWeight: 'bold',
            fontSize: config.style.fontSizes[element] * getSizeFactor(state, config),
            fontFamily: config.style.fontTypes[config.fontTypeIndex] || config.style.fontTypes[0],
            color: config.style.colors[config.color]
        });
    }, [ state, config, element ]);

    const raw = i18n(config.text, state.language);
    const __html = raw
        .split('*')
        .map((partial, index) => `${index ? ' ' : ''}<span style="white-space: nowrap">${partial}</span>`)
        .join('');

    return React.createElement(element, { style, dangerouslySetInnerHTML: { __html } });
}