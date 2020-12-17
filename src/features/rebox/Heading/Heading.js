import React, { useEffect } from 'react';
import useI18n from '../../../app/hooks/useI18n';
import useBoxStyle from '../../../app/hooks/useBoxStyle';
import useTextStyle from '../../../app/hooks/useTextStyle';


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
        .replace(/\*\*/g, '<br/>')
        .split('*')
        .map((e, i) => `${i ? ' ' : ''}<span style="white-space: nowrap">${e}</span>`)
        .join('');

    return React.createElement(props.as, { style, dangerouslySetInnerHTML: { __html } });
}