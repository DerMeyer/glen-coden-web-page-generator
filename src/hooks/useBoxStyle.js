import { useState, useCallback, useEffect } from 'react';


export default function useBoxStyle(props) {
    const [ input, setInput ] = useState(props);
    const [ style, setStyle ] = useState({});

    const getSpacing = useCallback(
        (e, x, y, t, r, b, l) => `${t || y || e || 0} ${r || x || e || 0} ${b || y || e || 0} ${l || x || e || 0}`,
        []
    );

    useEffect(() => {
        const { p, px, py, pt, pr, pb, pl, m, mx, my, mt, mr, mb, ml, fontSize, width, color, bg, shadow, css } = input;

        const r = {};

        r.padding = getSpacing(p, px, py, pt, pr, pb, pl);
        r.margin = getSpacing(m, mx, my, mt, mr, mb, ml);

        if (typeof fontSize !== 'undefined') {
            r.fontSize = fontSize;
        }
        if (typeof width !== 'undefined') {
            r.width = `${width * 100}%`;
        }
        if (typeof color !== 'undefined') {
            r.color = color;
        }
        if (typeof bg !== 'undefined') {
            r.backgroundColor = bg;
        }
        if (typeof shadow !== 'undefined') {
            r.boxShadow = shadow;
        }
        if (css) {
            setStyle({ ...r, ...css });
            return;
        }
        setStyle(r);
    }, [ input, getSpacing ]);

    return [ style, setInput ];
}