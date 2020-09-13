import { useState, useEffect } from 'react';


export default function useFlexStyle(props) {
    const [ input, setInput ] = useState(props);
    const [ style, setStyle ] = useState({});

    useEffect(() => {
        const { flexDirection, flexWrap, justifyContent, alignItems } = input;

        const r = {};

        if (typeof flexDirection !== 'undefined') {
            r.flexDirection = flexDirection;
        }
        if (typeof flexWrap !== 'undefined') {
            r.flexWrap = flexWrap;
        }
        if (typeof justifyContent !== 'undefined') {
            r.justifyContent = justifyContent;
        }
        if (typeof alignItems !== 'undefined') {
            r.alignItems = alignItems;
        }
        setStyle(r);
    }, [ input ]);

    return [ style, setInput ];
}