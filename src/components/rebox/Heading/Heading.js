import React, { useEffect } from 'react';
import useTextStyle from '../../../hooks/useTextStyle';
import useI18n from '../../../hooks/useI18n';


export default function Heading({ as, text, ...input }) {
    const { fontSize, fontWeight, lineHeight, color, css } = input;

    const [ style, setStyle ] = useTextStyle({});
    const [ translation, setTranslation ] = useI18n(text);

    useEffect(() => {
        setStyle({ fontSize, fontWeight, lineHeight, color, css });
    }, [ fontSize, fontWeight, lineHeight, color, css, setStyle ]);

    useEffect(() => {
        setTranslation(text);
    }, [ text, setTranslation ]);

    const __html = translation
        .split('*')
        .map((partial, index) => `${index ? ' ' : ''}<span style="white-space: nowrap">${partial}</span>`)
        .join('');

    return React.createElement(as, { style, dangerouslySetInnerHTML: { __html } });
}