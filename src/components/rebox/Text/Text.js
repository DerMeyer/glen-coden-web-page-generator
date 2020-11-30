import React, { useEffect } from 'react';
import s from './Text.module.css';
import useI18n from '../../../hooks/useI18n';
import useBoxStyle from '../../../hooks/useBoxStyle';
import useTextStyle from '../../../hooks/useTextStyle';


export default function Text(props) {
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

    return (
        <p
            className={s.Text}
            style={{
                ...boxStyle,
                ...textStyle
            }}
        >
            {translation}
        </p>
    );
}