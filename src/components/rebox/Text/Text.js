import React, { useEffect } from 'react';
import useTextStyle from '../../../hooks/useTextStyle';
import useI18n from '../../../hooks/useI18n';


export default function Text({ text, ...input }) {
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
        <p style={style}>
            {translation}
        </p>
    );
}