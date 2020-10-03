import { useState, useEffect } from 'react';


export default function useGridStyle(props) {
    const [ i, setInput ] = useState(props);
    const [ s, setStyle ] = useState({});

    useEffect(() => {
        const r = {};

        if (typeof i.gridTemplate !== 'undefined') {
            r.gridTemplate = i.gridTemplate;
        }
        if (typeof i.gridGap !== 'undefined') {
            r.gridGap = i.gridGap;
        }
        setStyle(r);
    }, [ i.gridTemplate, i.gridGap ]);

    return [ s, setInput ];
}