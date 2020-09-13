import React, { useEffect } from 'react';
import s from './Button.module.css';
import useTextStyle from '../../../hooks/useTextStyle';
import useI18n from '../../../hooks/useI18n';


export default function Button({ text, ...input }) {
    const { fontSize, fontWeight, lineHeight, color, css } = input;

    const [ style, setStyle ] = useTextStyle(input);
    const [ translation, setTranslation ] = useI18n(text);

    useEffect(() => {
        setStyle({ fontSize, fontWeight, lineHeight, color, css });
    }, [ fontSize, fontWeight, lineHeight, color, css, setStyle ]);

    useEffect(() => {
        setTranslation(text);
    }, [ text, setTranslation ]);

    return (
        <button
            className={s.button}
            style={style}
        >
            {translation}
        </button>
    );
}