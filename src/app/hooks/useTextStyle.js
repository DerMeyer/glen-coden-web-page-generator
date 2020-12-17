import { useState, useEffect } from 'react';


export default function useTextStyle(props) {
    const [ i, setInput ] = useState(props);
    const [ s, setStyle ] = useState({});

    useEffect(() => {
        const r = {};

        if (typeof i.font !== 'undefined') {
            r.fontFamily = i.font;
        }
        if (typeof i.fontSize !== 'undefined') {
            r.fontSize = i.fontSize;
        }
        if (typeof i.fontWeight !== 'undefined') {
            r.fontWeight = i.fontWeight;
        }
        if (typeof i.fontStyle !== 'undefined') {
            r.fontStyle = i.fontStyle;
        }
        if (typeof i.lineHeight !== 'undefined') {
            r.lineHeight = i.lineHeight;
        }
        if (typeof i.color !== 'undefined') {
            r.color = i.color;
        }
        setStyle(r);
    }, [ i.font, i.fontSize, i.fontWeight, i.fontStyle, i.lineHeight, i.color ]);

    return [ s, setInput ];
}