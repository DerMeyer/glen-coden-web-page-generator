import { useState, useCallback, useEffect } from 'react';


export default function useBoxStyle(props) {
    const [ i, setInput ] = useState(props);
    const [ s, setStyle ] = useState({});

    const getSpacing = useCallback(
        (e, x, y, t, r, b, l) => `${t || y || e || 0} ${r || x || e || 0} ${b || y || e || 0} ${l || x || e || 0}`,
        []
    );

    useEffect(() => {
        const r = {};

        r.padding = getSpacing(i.p, i.px, i.py, i.pt, i.pr, i.pb, i.pl);
        r.margin = getSpacing(i.m, i.mx, i.my, i.mt, i.mr, i.mb, i.ml);

        if (typeof i.fontSize !== 'undefined') {
            r.fontSize = i.fontSize;
        }
        if (typeof i.width !== 'undefined') {
            if (i.width > 1) {
                r.width = `${i.width}px`;
            } else {
                r.width = `${i.width * 100}%`;
            }
        }
        if (typeof i.color !== 'undefined') {
            r.color = i.color;
        }
        if (typeof i.bg !== 'undefined') {
            r.backgroundColor = i.bg;
        }
        if (typeof i.shadow !== 'undefined') {
            r.boxShadow = i.shadow;
        }
        if (i.css) {
            setStyle({ ...r, ...i.css });
            return;
        }
        setStyle(r);
    }, [ getSpacing, i.p, i.px, i.py, i.pt, i.pr, i.pb, i.pl, i.m, i.mx, i.my, i.mt, i.mr, i.mb, i.ml, i.fontSize, i.width, i.color, i.bg, i.shadow, i.css ]);

    return [ s, setInput ];
}