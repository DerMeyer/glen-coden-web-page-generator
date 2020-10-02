import { useState, useEffect } from 'react';


export default function useTextStyle(props) {
    const [ i, setInput ] = useState(props);
    const [ s, setStyle ] = useState({});

    useEffect(() => {
        const r = {};

        if (typeof i.fontSize !== 'undefined') {
            r.fontSize = i.fontSize;
        }
        if (typeof i.fontWeight !== 'undefined') {
            r.fontWeight = i.fontWeight;
        }
        if (typeof i.textDecoration !== 'undefined') {
            r.textDecoration = i.textDecoration;
        }
        if (typeof i.lineHeight !== 'undefined') {
            r.lineHeight = i.lineHeight;
        }
        if (typeof i.color !== 'undefined') {
            r.color = i.color;
        }
        setStyle(r);
    }, [ i.fontSize, i.fontWeight, i.textDecoration, i.lineHeight, i.color ]);

    return [ s, setInput ];
}