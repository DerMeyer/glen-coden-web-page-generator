import { useState, useEffect } from 'react';


export default function useFlexStyle(props) {
    const [ i, setInput ] = useState(props);
    const [ s, setStyle ] = useState({});

    useEffect(() => {
        const r = {};

        if (typeof i.flexDirection !== 'undefined') {
            r.flexDirection = i.flexDirection;
        }
        if (typeof i.flexWrap !== 'undefined') {
            r.flexWrap = i.flexWrap;
        }
        if (typeof i.justifyContent !== 'undefined') {
            r.justifyContent = i.justifyContent;
        }
        if (typeof i.alignItems !== 'undefined') {
            r.alignItems = i.alignItems;
        }
        setStyle(r);
    }, [ i.flexDirection, i.flexWrap, i.justifyContent, i.alignItems ]);

    return [ s, setInput ];
}