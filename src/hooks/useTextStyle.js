import { useState, useEffect } from 'react';


export default function useTextStyle(props) {
    const [ input, setInput ] = useState(props);
    const [ style, setStyle ] = useState({});

    useEffect(() => {
        const { fontSize, fontWeight, lineHeight, color, css } = input;

        const r = {};

        if (typeof fontSize !== 'undefined') {
            r.fontSize = fontSize;
        }
        if (typeof fontWeight !== 'undefined') {
            r.fontWeight = fontWeight;
        }
        if (typeof lineHeight !== 'undefined') {
            r.lineHeight = lineHeight;
        }
        if (typeof color !== 'undefined') {
            r.color = color;
        }
        if (css) {
            setStyle({ ...r, ...css });
            return;
        }
        setStyle(r);
    }, [ input ]);

    return [ style, setInput ];
}