import { useState, useEffect } from 'react';


export default function useGridStyle(props) {
    const [ i, setInput ] = useState(props);
    const [ s, setStyle ] = useState({});

    useEffect(() => {
        const r = {};

        if (typeof i.gridTemplate !== 'undefined') {
            r.gridTemplate = i.gridTemplate;
        }
        if (typeof i.gap !== 'undefined') {
            r.gap = i.gap;
        }
        if (typeof i.columnGap !== 'undefined') {
            r.columnGap = i.columnGap;
        }
        if (typeof i.rowGap !== 'undefined') {
            r.rowGap = i.rowGap;
        }
        setStyle(r);
    }, [ i.gridTemplate, i.gap, i.columnGap, i.rowGap ]);

    return [ s, setInput ];
}