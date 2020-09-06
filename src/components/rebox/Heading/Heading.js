import React, { useContext, useState, useEffect } from 'react';
import Store from '../../../store/Store';
import { getSizeFactor, i18n } from '../../../js/helpers';

Heading.defaultProps = {
    global: {}
};


export default function Heading({ global, size, fontTypeIndex, color, text, sizing }) {
    const { state } = useContext(Store);

    const [ element, setElement ] = useState('h1');
    const [ style, setStyle ] = useState({});

    useEffect(() => {
        switch (size) {
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
    }, [ size ]);

    const { fontTypes = {}, colors = {}, fontSizes = {} } = global;
    const fontType = fontTypes[fontTypeIndex] || fontTypes[0];

    useEffect(() => {
        setStyle({
            margin: 0,
            lineHeight: '1.3',
            fontWeight: 'bold',
            fontSize: fontSizes[element] * getSizeFactor(state, sizing),
            fontFamily: fontType.name || '',
            color: colors[color]
        });
    }, [ state, fontSizes, colors, color, sizing, element, fontType ]);

    const raw = i18n(text, state.language);
    const __html = raw
        .split('*')
        .map((partial, index) => `${index ? ' ' : ''}<span style="white-space: nowrap">${partial}</span>`)
        .join('');

    return React.createElement(element, { style, dangerouslySetInnerHTML: { __html } });
}