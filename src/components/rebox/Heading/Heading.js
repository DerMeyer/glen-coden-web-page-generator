import React, { useEffect } from 'react';
import useI18n from '../../../hooks/useI18n';
import useBoxStyle from '../../../hooks/useBoxStyle';
import useTextStyle from '../../../hooks/useTextStyle';


export default function Heading(props) {
    const [ translation, setTranslation ] = useI18n(props.text);
    const [ boxStyle, getBoxStyle ] = useBoxStyle(props);
    const [ textStyle, getTextStyle ] = useTextStyle(props);

    useEffect(() => {
        getBoxStyle(props);
        getTextStyle(props);
    });

    useEffect(() => {
        setTranslation(props.text);
    }, [ props.text, setTranslation ]);

    const style = { ...boxStyle, ...textStyle };

    const __html = translation
        .split('*')
        .map((partial, index) => `${index ? ' ' : ''}<span style="white-space: nowrap">${partial}</span>`)
        .join('');

    return React.createElement(props.as, { style, dangerouslySetInnerHTML: { __html } });
}